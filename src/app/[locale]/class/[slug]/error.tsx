"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#80D893] p-2 lg:p-4">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center py-20">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-gray-500">Failed to load this game.</p>
          <button
            onClick={reset}
            className="mt-4 rounded-full bg-green-600 px-6 py-2 text-sm font-bold text-white hover:bg-green-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="mt-2 block text-sm text-green-700 underline hover:text-green-900"
          >
            Back to homepage
          </a>
        </div>
      </div>
    </main>
  );
}
