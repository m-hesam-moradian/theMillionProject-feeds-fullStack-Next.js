"use client";

import { voteOnPoll } from "@/lib/actions";
import { useState } from "react";
import Swal from "sweetalert2";

type PollBlockProps = {
  postId: string;
  options: {
    description: string;
    voters: { userId: string }[];
  }[];
};

export default function PollBlock({ postId, options }: PollBlockProps) {
  const [loading, setLoading] = useState<number | null>(null);

  const totalVotes = options.reduce(
    (sum, option) => sum + (option.voters?.length || 0),
    0
  );

  const handleVote = async (pollIndex: number) => {
    setLoading(pollIndex);

    const result = await voteOnPoll(postId, pollIndex);

    setLoading(null);

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.error,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Vote submitted!",
        text: "Thanks for participating in the poll.",
      });
    }
  };

  return (
    <div className="grid mt-4 gap-2">
      {options.map((option, index) => {
        const voteCount = option.voters?.length || 0;
        const percentage = totalVotes
          ? Math.round((voteCount / totalVotes) * 100)
          : 0;

        return (
          <button
            key={index}
            onClick={() => handleVote(index)}
            disabled={loading === index}
            className="relative w-full text-left px-4 py-2 rounded-md overflow-hidden bg-slate-100"
          >
            {/* Background progress */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-200"
              style={{ width: `${percentage}%` }}
            ></div>

            {/* Content on top */}
            <div className="relative flex justify-between text-sm text-gray-700 font-medium">
              <span>{option.description}</span>
              <span>
                {voteCount} vote{voteCount !== 1 ? "s" : ""} ({percentage}%)
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}