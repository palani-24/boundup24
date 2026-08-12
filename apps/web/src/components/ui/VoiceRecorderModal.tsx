import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Check, X } from 'lucide-react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioRecorded: (audioFile: File, audioUrl: string) => void;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({ isOpen, onClose, onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });

        setAudioUrl(url);
        setRecordedFile(file);

        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setTimer(0);

      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or not supported');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleReset = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioUrl(null);
    setRecordedFile(null);
    setTimer(0);
    clearInterval(timerIntervalRef.current);
  };

  const handleConfirm = () => {
    if (recordedFile && audioUrl) {
      onAudioRecorded(recordedFile, audioUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm border border-gray-100 dark:border-slate-700 shadow-2xl text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Mic className="w-5 h-5 text-orange-500" /> Record Voice Note
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer display */}
        <div className="my-6">
          <div className="text-3xl font-mono font-bold text-orange-500">
            00:{timer < 10 ? `0${timer}` : timer}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {isRecording ? 'Recording audio...' : audioUrl ? 'Voice note recorded!' : 'Tap mic to start'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!audioUrl ? (
            !isRecording ? (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 active:scale-95 transition-transform"
              >
                <Mic className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-95 transition-transform animate-pulse"
              >
                <Square className="w-7 h-7" />
              </button>
            )
          ) : (
            <>
              <button
                onClick={handleReset}
                className="p-3.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-500 transition-colors"
                title="Discard"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleConfirm}
                className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md hover:bg-orange-600 transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" /> Use Voice Note
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
