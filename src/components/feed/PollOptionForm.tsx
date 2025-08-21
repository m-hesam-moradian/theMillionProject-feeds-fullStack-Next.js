// This is a Server Component by default (no "use client" at the top)
import { voteOnPoll } from "@/lib/actions";

export default function PollOptionForm({
  pollId,
  optionId,
  children,
}: {
  pollId: number;
  optionId: number;
  children: React.ReactNode;
}) {
  async function handleVote() {
    "use server";
    await voteOnPoll(pollId, optionId);
  }

  return (
    <form action={handleVote}>
      {children}
      <button
        type="submit"
        className="mt-1 text-xs text-blue-600 hover:underline self-end"
      >
        Vote
      </button>
    </form>
  );
}
