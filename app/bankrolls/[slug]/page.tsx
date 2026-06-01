"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "next/navigation";
export default function BankrollDetailsPage() {
  const params = useParams();
const bankrollId = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [isAddBetOpen, setIsAddBetOpen] = useState(false);
  const [bets, setBets] = useState<any[]>([]);
  const deleteBet = (id: number) => {
  setBets(bets.filter((bet) => bet.id !== id));
};
const updateBetStatus = (id: number, status: "Won" | "Lost" | "Wait") => {
  setBets(
    bets.map((bet) => {
      if (bet.id !== id) return bet;

      const stake = Number(bet.stake);
      const odds = Number(bet.odds);

      const profit =
        status === "Won"
          ? stake * odds - stake
          : status === "Lost"
          ? -stake
          : 0;

      return {
        ...bet,
        status,
        profit,
      };
    })
  );
};
async function fetchBets() {
  const { data, error } = await supabase
    .from("bets")
    .select("*")
    .eq("bankroll_id", bankrollId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setBets(data || []);
  setLoading(false);
}

useEffect(() => {
  if (bankrollId) {
    fetchBets();
  }
}, [bankrollId]);

const [newBet, setNewBet] = useState({
  date: "",
  time: "",
  bookmaker: "",
  title: "",
  odds: "",
  stake: "",
});
const addBet = async () => {
  if (!newBet.title || !newBet.odds || !newBet.stake) return;

  const { error } = await supabase.from("bets").insert({
    bankroll_id: bankrollId,
    title: newBet.title,
    bookmaker: newBet.bookmaker,
    odds: Number(newBet.odds),
    stake: Number(newBet.stake),
    status: "Wait",
    profit: 0,
  });

if (error) {
  console.log("SUPABASE ERROR:", error);
  alert(JSON.stringify(error, null, 2));
  return;
}

  setNewBet({
    date: "",
    time: "",
    bookmaker: "",
    title: "",
    odds: "",
    stake: "",
  });

  setIsAddBetOpen(false);
  fetchBets();
};
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FS TIPS</h1>
          <p className="mt-2 text-zinc-400">
            Szczegóły bankrolla i historia zakładów.
          </p>
        </div>

<button
  onClick={() => setIsAddBetOpen(true)}
  className="rounded-xl bg-indigo-600 px-5 py-3 font-bold hover:bg-indigo-500"
>
  + Dodaj zakład
</button>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
          <p className="text-sm text-zinc-400">ZAKŁADY</p>
          <p className="mt-3 text-3xl font-black text-blue-400">30</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
          <p className="text-sm text-zinc-400">ZYSKI</p>
          <p className="mt-3 text-3xl font-black text-green-400">553.40 CHF</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
          <p className="text-sm text-zinc-400">ROI</p>
          <p className="mt-3 text-3xl font-black text-green-400">102.48%</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl">
          <p className="text-sm text-zinc-400">POSTĘP</p>
          <p className="mt-3 text-3xl font-black text-green-400">553.40%</p>
        </div>
      </div>
      <div className="mb-8 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-5 shadow-xl">
  <h2 className="mb-4 text-xl font-bold">Dodane zakłady</h2>

  <div className="space-y-3">
    {bets.map((bet) => (
      <div
        key={bet.id}
        className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 rounded-xl bg-white/5 p-4"
      >
        <div className="md:col-span-2">
          <p className="font-semibold">⚽ {bet.title}</p>
          <p className="text-xs text-zinc-400">
            {bet.date} • {bet.time} • {bet.bookmaker}
          </p>
        </div>

        <div>
          <p className="font-bold">{bet.odds}</p>
          <p className="text-xs text-zinc-400">Kurs</p>
        </div>

        <div>
          <p className="font-bold">{bet.stake} CHF</p>
          <p className="text-xs text-zinc-400">Stawka</p>
        </div>

        <div>
<p
  className={`font-bold ${
    bet.status === "Won"
      ? "text-green-400"
      : bet.status === "Lost"
      ? "text-red-400"
      : "text-yellow-400"
  }`}
>
  {bet.status}
</p>

<p className="text-xs text-zinc-400">Status</p>
        </div>

        <div>
<p
  className={`font-bold ${
    Number(bet.profit) > 0
      ? "text-green-400"
      : Number(bet.profit) < 0
      ? "text-red-400"
      : "text-zinc-300"
  }`}
>
  {Number(bet.profit || 0).toFixed(2)} CHF
</p>

<p className="text-xs text-zinc-400">Zysk</p>
        </div>
        <div className="flex gap-2">
<button
  onClick={() => updateBetStatus(bet.id, "Won")}
  className="rounded-lg bg-green-700 px-3 py-1 text-xs font-bold"
>
  Won
</button>

<button
  onClick={() => updateBetStatus(bet.id, "Lost")}
  className="rounded-lg bg-red-700 px-3 py-1 text-xs font-bold"
>
  Lost
</button>

<button
  onClick={() => updateBetStatus(bet.id, "Wait")}
  className="rounded-lg bg-yellow-600 px-3 py-1 text-xs font-bold"
>
  Wait
</button>

<button
  onClick={() => deleteBet(bet.id)}
  className="rounded-lg bg-zinc-700 px-3 py-1 text-xs font-bold"
>
  Delete
</button>
</div>
      </div>
    ))}

    {bets.length === 0 && (
      <p className="text-zinc-400">Brak dodanych zakładów.</p>
    )}
  </div>
</div>


      {isAddBetOpen && (
  <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
    <div className="h-full w-full max-w-xl border-l border-white/10 bg-[#070b18] p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dodaj zakład</h2>

        <button
          onClick={() => setIsAddBetOpen(false)}
          className="text-2xl text-zinc-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
<input
  className="rounded-xl bg-zinc-900 p-3"
  placeholder="Data"
  value={newBet.date}
  onChange={(e) =>
    setNewBet({ ...newBet, date: e.target.value })
  }
/>
<input
  className="rounded-xl bg-zinc-900 p-3"
  placeholder="Czas"
  value={newBet.time}
  onChange={(e) =>
    setNewBet({ ...newBet, time: e.target.value })
  }
/>
      </div>

<div className="mt-4 space-y-4">
  <input
    className="w-full rounded-xl bg-zinc-900 p-3"
    placeholder="Bukmacher"
    value={newBet.bookmaker}
    onChange={(e) =>
      setNewBet({ ...newBet, bookmaker: e.target.value })
    }
  />

  <input
    className="w-full rounded-xl bg-zinc-900 p-3"
    placeholder="Tytuł zakładu"
    value={newBet.title}
    onChange={(e) =>
      setNewBet({ ...newBet, title: e.target.value })
    }
  />

  <input
    className="w-full rounded-xl bg-zinc-900 p-3"
    placeholder="Kurs"
    value={newBet.odds}
    onChange={(e) =>
      setNewBet({ ...newBet, odds: e.target.value })
    }
  />

  <input
    className="w-full rounded-xl bg-zinc-900 p-3"
    placeholder="Stawka CHF"
    value={newBet.stake}
    onChange={(e) =>
      setNewBet({ ...newBet, stake: e.target.value })
    }
  />
</div>

<button
  onClick={addBet}
  className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold hover:bg-indigo-500"
>
  Dodaj zakład
</button>
    </div>
  </div>
)}
    </>
  );
}