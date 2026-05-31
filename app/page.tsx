"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Bet = {
  id: number;
  event_name: string;
  selection: string;
  odds: number;
  stake: number;
  status: string;
  profit: number;
  created_at: string;
};

export default function Home() {
  const [eventName, setEventName] = useState("");
  const [selection, setSelection] = useState("");
  const [odds, setOdds] = useState("");
  const [stake, setStake] = useState("");
  const [message, setMessage] = useState("");
  const [bets, setBets] = useState<Bet[]>([]);

  async function fetchBets() {
    const { data, error } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading bets: " + error.message);
      return;
    }

    setBets(data || []);
  }

  async function addBet() {
    setMessage("");

    const oddsNumber = Number(odds);
    const stakeNumber = Number(stake);

    if (!eventName || !selection || !oddsNumber || !stakeNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("bets").insert({
      event_name: eventName,
      selection,
      odds: oddsNumber,
      stake: stakeNumber,
      status: "Pending",
      profit: 0,
    });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setEventName("");
    setSelection("");
    setOdds("");
    setStake("");
    setMessage("Bet added successfully!");
    fetchBets();
  }

  async function updateBetStatus(bet: Bet, newStatus: "Won" | "Lost") {
    const profit =
      newStatus === "Won"
        ? bet.stake * bet.odds - bet.stake
        : -bet.stake;

    const { error } = await supabase
      .from("bets")
      .update({
        status: newStatus,
        profit,
      })
      .eq("id", bet.id);

    if (error) {
      setMessage("Error updating bet: " + error.message);
      return;
    }

    fetchBets();
  }

  useEffect(() => {
    fetchBets();
  }, []);

  const totalBets = bets.length;
  const totalStake = bets.reduce((sum, bet) => sum + Number(bet.stake), 0);
  const totalProfit = bets.reduce((sum, bet) => sum + Number(bet.profit), 0);
  const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
  const wonBets = bets.filter((bet) => bet.status === "Won").length;
  const settledBets = bets.filter((bet) => bet.status !== "Pending").length;
  const winRate = settledBets > 0 ? (wonBets / settledBets) * 100 : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Bet Tracker PRO</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Total Bets</p>
          <p className="text-2xl font-bold">{totalBets}</p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Total Stake</p>
          <p className="text-2xl font-bold">{totalStake.toFixed(2)}</p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Profit</p>
          <p className="text-2xl font-bold">{totalProfit.toFixed(2)}</p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">ROI / Win Rate</p>
          <p className="text-2xl font-bold">
            {roi.toFixed(2)}% / {winRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="max-w-md space-y-4 mb-10">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800"
        />

        <input
          type="text"
          placeholder="Selection"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800"
        />

        <input
          type="number"
          placeholder="Odds"
          value={odds}
          onChange={(e) => setOdds(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800"
        />

        <input
          type="number"
          placeholder="Stake"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800"
        />

        <button
          onClick={addBet}
          className="bg-green-600 px-5 py-3 rounded font-bold"
        >
          Add Bet
        </button>

        {message && <p className="text-sm text-zinc-300">{message}</p>}
      </div>

      <h2 className="text-2xl font-bold mb-4">My Bets</h2>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-3">Event</th>
              <th className="p-3">Selection</th>
              <th className="p-3">Odds</th>
              <th className="p-3">Stake</th>
              <th className="p-3">Status</th>
              <th className="p-3">Profit</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bets.map((bet) => (
              <tr key={bet.id} className="border-t border-zinc-800">
                <td className="p-3">{bet.event_name}</td>
                <td className="p-3">{bet.selection}</td>
                <td className="p-3">{Number(bet.odds).toFixed(2)}</td>
                <td className="p-3">{Number(bet.stake).toFixed(2)}</td>
                <td className="p-3">{bet.status}</td>
<td
  className={`p-3 font-bold ${
    Number(bet.profit) > 0
      ? "text-green-400"
      : Number(bet.profit) < 0
      ? "text-red-400"
      : "text-zinc-300"
  }`}
>
  {Number(bet.profit).toFixed(2)}
</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => updateBetStatus(bet, "Won")}
                    className="bg-green-700 px-3 py-1 rounded text-sm"
                  >
                    Won
                  </button>

                  <button
                    onClick={() => updateBetStatus(bet, "Lost")}
                    className="bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Lost
                  </button>
                </td>
              </tr>
            ))}

            {bets.length === 0 && (
              <tr>
                <td className="p-3 text-zinc-400" colSpan={7}>
                  No bets yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}