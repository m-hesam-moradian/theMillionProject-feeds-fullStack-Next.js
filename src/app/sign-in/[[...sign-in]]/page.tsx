import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[calc(100vh-131px)] flex items-center justify-center">
      <SignIn />
    </div>
  );
}
