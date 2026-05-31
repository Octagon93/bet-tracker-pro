export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-6xl font-bold mb-6">
          Bet Tracker PRO
        </h1>

        <p className="text-xl text-zinc-300 mb-10 max-w-2xl">
          Track your bets. Analyze your performance. Compete with other bettors.
        </p>

        <div className="flex gap-4">
          <button className="rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500">
            Get Started
          </button>

          <button className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold hover:bg-zinc-800">
            Login
          </button>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-zinc-900 p-6">
            <h3 className="text-xl font-bold mb-2">Track Bets</h3>
            <p className="text-zinc-400">
              Save all your bets in one place.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h3 className="text-xl font-bold mb-2">Analyze ROI</h3>
            <p className="text-zinc-400">
              Automatically calculate profit, ROI and win rate.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
            <p className="text-zinc-400">
              Compete with the best tipsters.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}