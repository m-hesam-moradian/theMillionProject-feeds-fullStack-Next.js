const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eff2ef]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

