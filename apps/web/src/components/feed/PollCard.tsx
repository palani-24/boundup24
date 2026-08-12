import React, { useState } from 'react';
import { IPoll } from '@boundup/shared';
import { api } from '../../services/api';
import { CheckCircle2 } from 'lucide-react';

interface PollCardProps {
  postId: string;
  poll: IPoll;
  currentUserId?: string;
}

export const PollCard: React.FC<PollCardProps> = ({ postId, poll: initialPoll, currentUserId }) => {
  const [poll, setPoll] = useState<IPoll>(initialPoll);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = poll.options.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0);

  const handleVote = async (optionId: string) => {
    if (!currentUserId || isVoting) return;
    setIsVoting(true);

    try {
      const res = await api.post(`/posts/${postId}/vote`, { optionId });
      if (res.data?.success && res.data.poll) {
        const updatedPoll = res.data.poll;
        setPoll({
          id: postId,
          question: updatedPoll.question,
          options: updatedPoll.options.map((opt: any) => ({
            id: opt._id?.toString() || opt.id,
            text: opt.text,
            votes: opt.votes.map((v: any) => v.toString()),
          })),
          totalVotes: updatedPoll.options.reduce((acc: number, opt: any) => acc + opt.votes.length, 0),
        });
      }
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="mt-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-slate-800/80 border border-orange-100 dark:border-slate-700">
      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-between">
        <span>📊 {poll.question}</span>
        <span className="text-xs font-normal text-gray-500 dark:text-slate-400">{totalVotes} votes</span>
      </h4>

      <div className="space-y-2.5">
        {poll.options.map((opt) => {
          const optVotes = opt.votes?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const hasVotedThis = currentUserId ? opt.votes?.includes(currentUserId) : false;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={isVoting}
              className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all border ${
                hasVotedThis
                  ? 'border-orange-500 bg-orange-500/10 font-semibold'
                  : 'border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-slate-600 bg-white/70 dark:bg-slate-900/50'
              }`}
            >
              {/* Progress fill bar */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-orange-500/15 dark:bg-orange-500/25 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative flex items-center justify-between z-10 text-sm">
                <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  {hasVotedThis && <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />}
                  {opt.text}
                </span>
                <span className="text-xs font-bold text-gray-600 dark:text-slate-300 ml-2">{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
