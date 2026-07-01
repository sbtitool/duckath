export default function Loading() {
  return (
    <main className="min-h-screen p-2 lg:p-4">
      <div className="mx-auto flex max-w-[1420px] items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-900 border-t-transparent" />
          <span className="text-sm font-bold text-green-900">Loading game...</span>
        </div>
      </div>
    </main>
  );
}
