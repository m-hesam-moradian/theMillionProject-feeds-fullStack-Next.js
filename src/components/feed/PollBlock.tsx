import { voteOnPoll } from "@/lib/actions";

type PollBlockProps = {
  pollId: number;
  options: {
    id: number;
    text: string;
    votes: { userId: string }[];
  }[];
};

export default function PollBlock({ pollId, options }: PollBlockProps) {
  const totalVotes = options.reduce(
    (sum, option) => sum + (option.votes?.length || 0),
    0
  );

  return (
    <div className="flex flex-col gap-3 mt-2 border border-blue-300 p-4 rounded-md bg-blue-50">
      {options.map((option) => {
        const voteCount = option.votes?.length || 0;
        const percentage = totalVotes
          ? Math.round((voteCount / totalVotes) * 100)
          : 0;

        return (
          <form
            key={option.id}
            action={async () => {
              "use server";
              await voteOnPoll(pollId, option.id);
            }}
            className="flex flex-col gap-1"
          >
            <div className="flex justify-between text-sm text-gray-700">
              <span>{option.text}</span>
              <span>
                {voteCount} vote{voteCount !== 1 ? "s" : ""} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <button
              type="submit"
              className="mt-1 text-xs text-blue-600 hover:underline self-end"
            >
              Vote
            </button>
          </form>
        );
      })}
    </div>
  );
}
