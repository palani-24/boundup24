import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  duration?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setProgress((current / dur) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-full bg-orange-500/10 dark:bg-slate-800 border border-orange-500/20 max-w-sm">
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition-transform active:scale-95 shrink-0"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Waveform pill bars */}
      <div className="flex-1 flex items-center gap-0.5 h-6">
        {[40, 70, 30, 90, 50, 80, 100, 60, 40, 90, 70, 50, 80, 30, 60, 90, 40].map((h, idx) => {
          const isActive = (idx / 17) * 100 <= progress;
          return (
            <div
              key={idx}
              className={`flex-1 rounded-full transition-all duration-200 ${
                isActive ? 'bg-orange-500' : 'bg-orange-200 dark:bg-slate-600'
              }`}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>

      <Volume2 className="w-4 h-4 text-orange-500 shrink-0 mr-1" />

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
};
