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
    <div className="grid  mt-4 gap-2">
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
          >
            <button
              type="submit"
              className="relative w-full text-left px-4 py-2 rounded-md overflow-hidden bg-slate-100"
            >
              {/* Background progress */}
              <div
                className="absolute top-0 left-0 h-full bg-blue-200"
                style={{ width: `${percentage}%` }}
              ></div>

              {/* Content on top */}
              <div className="relative flex justify-between text-sm text-gray-700 font-medium">
                <span>{option.text}</span>
                <span>
                  {voteCount} vote{voteCount !== 1 ? "s" : ""} ({percentage}%)
                </span>
              </div>
            </button>
          </form>
        );
      })}
    </div>
  );
}
