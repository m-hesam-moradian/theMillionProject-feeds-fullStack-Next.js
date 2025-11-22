"use client";

import { useTransition, useState } from "react";
import { voteOnPoll } from "@/lib/actions";

export default function PollOptionClient({
  pollId,
  optionId,
  children,
}: {
  pollId: string;
  optionId: number;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleVote = () => {
    setError(null);
    startTransition(async () => {
      try {
        await voteOnPoll(pollId, optionId);
      } catch (err: any) {
        setError(err.message || "Failed to vote.");
      }
    });
  };

  return (
    <div className=" flex flex-col gap-1">
      {children}
      <button
        onClick={handleVote}
        disabled={isPending}
        className={`mt-1 text-xs text-blue-600 hover:underline self-end ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPending ? "Voting..." : "Vote"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
