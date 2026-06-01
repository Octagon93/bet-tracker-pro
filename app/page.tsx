"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Target,
  Ticket
} from "lucide-react";
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
      status: "Wait",
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

  async function updateBetStatus(bet: Bet, newStatus: "Won" | "Lost" | "Wait"
) {
const profit =
  newStatus === "Won"
    ? bet.stake * bet.odds - bet.stake
    : newStatus === "Lost"
    ? -bet.stake
    : 0;

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
async function deleteBet(id: number) {
  const { error } = await supabase
    .from("bets")
    .delete()
    .eq("id", id);

  if (error) {
    setMessage("Error deleting bet: " + error.message);
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
  const settledBets = bets.filter((bet) => bet.status !== "Wait").length;
  const winRate = settledBets > 0 ? (wonBets / settledBets) * 100 : 0;

return (
  <>
    <div className="mb-10">
                <h2 className="text-4xl font-bold">Dashboard</h2>
          <p className="mt-2 text-zinc-400">Przegląd Twoich wyników</p>
        </div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
  <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-zinc-300">PROFIT</p>
      <div className="rounded-full bg-green-500/20 p-3">
        <Wallet size={22} className="text-green-400" />
      </div>
    </div>
    <p className="mt-5 text-3xl font-black text-green-400">
      {totalProfit.toFixed(2)} CHF
    </p>
    <p className="mt-5 text-sm text-zinc-400">Suma zysków</p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-zinc-300">ROI</p>
      <div className="rounded-full bg-blue-500/20 p-3">
        <TrendingUp size={22} className="text-blue-400" />
      </div>
    </div>
    <p className="mt-5 text-3xl font-black text-blue-400">
      {roi.toFixed(2)}%
    </p>
    <p className="mt-5 text-sm text-zinc-400">Profit / stawki</p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-zinc-300">WIN RATE</p>
      <div className="rounded-full bg-purple-500/20 p-3">
        <Target size={22} className="text-purple-400" />
      </div>
    </div>
    <p className="mt-5 text-3xl font-black text-purple-400">
      {winRate.toFixed(2)}%
    </p>
    <p className="mt-5 text-sm text-zinc-400">Wygrane / rozliczone</p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-zinc-300">LICZBA ZAKŁADÓW</p>
      <div className="rounded-full bg-orange-500/20 p-3">
        <Ticket size={22} className="text-orange-400" />
      </div>
    </div>
    <p className="mt-5 text-3xl font-black text-orange-400">
      {totalBets}
    </p>
    <p className="mt-5 text-sm text-zinc-400">Wszystkie zakłady</p>
  </div>
</div>

    </>
  );
}