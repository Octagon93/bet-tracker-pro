"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Bankroll = {
  id: string;
  name: string;
  created_at: string;
};

export default function BankrollsPage() {
  const [bankrolls, setBankrolls] = useState<Bankroll[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [bankrollName, setBankrollName] = useState("");
  const [message, setMessage] = useState("");

  async function fetchBankrolls() {
    const { data, error } = await supabase
      .from("bankrolls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading bankrolls: " + error.message);
      return;
    }

    setBankrolls(data || []);
  }

  async function addBankroll() {
    if (!bankrollName.trim()) return;

    const { error } = await supabase.from("bankrolls").insert({
      name: bankrollName,
    });

    if (error) {
      setMessage("Error adding bankroll: " + error.message);
      return;
    }

    setBankrollName("");
    setShowForm(false);
    fetchBankrolls();
  }

  useEffect(() => {
    fetchBankrolls();
  }, []);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Bankrolls</h1>
        <p className="mt-2 text-zinc-400">
          Twórz osobne bankrolle dla różnych strategii.
        </p>

        {message && (
          <p className="mt-3 text-sm text-red-400">{message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bankrolls.map((bankroll) => (
          <Link
            key={bankroll.id}
            href={`/bankrolls/${bankroll.id}`}
            className="block rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-xl hover:border-green-400/50 transition"
          >
            <h2 className="mb-6 text-xl font-bold">{bankroll.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-xl bg-white/5 p-5">
                <p className="text-sm text-zinc-400">ROI</p>
                <p className="mt-3 text-2xl font-black text-green-400">
                  0.00%
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-5">
                <p className="text-sm text-zinc-400">Profit</p>
                <p className="mt-3 text-2xl font-black text-green-400">
                  0 CHF
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-5">
                <p className="text-sm text-zinc-400">Zakłady</p>
                <p className="mt-3 text-2xl font-black text-orange-400">0</p>
              </div>
            </div>
          </Link>
        ))}

        <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 backdrop-blur-md p-6 shadow-xl min-h-[190px] flex items-center justify-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="text-zinc-300 hover:text-green-400 text-xl font-bold"
            >
              + Dodaj bankroll
            </button>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <input
                type="text"
                placeholder="Nazwa bankrolla, np. Swisslos Main"
                value={bankrollName}
                onChange={(e) => setBankrollName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 p-3 outline-none focus:border-green-400"
              />

              <div className="flex gap-3">
                <button
                  onClick={addBankroll}
                  className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-500"
                >
                  Zapisz
                </button>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setBankrollName("");
                    setMessage("");
                  }}
                  className="rounded-xl bg-zinc-700 px-5 py-3 font-bold hover:bg-zinc-600"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}