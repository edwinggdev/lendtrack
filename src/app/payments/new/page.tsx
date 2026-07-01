"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

export default function PaymentRegister() {
  const [amount, setAmount] = useState("1250.00");

  function handleNumpad(val: string) {
    if (val === "backspace") {
      setAmount((prev) => {
        const next = prev.slice(0, -1);
        return next === "" ? "0" : next;
      });
    } else {
      setAmount((prev) => {
        if (prev === "0") return val;
        return prev + val;
      });
    }
  }

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile mt-stack-lg pb-24">
        <div className="max-w-md mx-auto space-y-stack-lg">
          <div className="space-y-base">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Registro Pago</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Update the loan ledger for your client.</p>
          </div>

          <section className="bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.08)] space-y-stack-md border border-outline-variant/30">
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Select Client</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                  className="w-full h-touch-target pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:border-secondary transition-colors"
                  placeholder="Search by name or ID..."
                  type="text"
                  defaultValue="Marcus Thompson"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                </div>
              </div>
            </div>

            <div className="space-y-base pt-2">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Monto a Pagar</label>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center space-y-1">
                <div className="flex items-baseline text-secondary">
                  <span className="font-amount-display text-amount-display mr-1">$</span>
                  <span className="font-amount-display text-amount-display">
                    {Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Current Balance: $4,500.00</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">calendar_today</span>
                  <input
                    className="w-full h-touch-target pl-9 pr-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md appearance-none"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Method</label>
                <select className="w-full h-touch-target px-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md appearance-none">
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Mobile Money</option>
                  <option>Cheque</option>
                </select>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((key) => (
              <button
                key={key}
                onClick={() => handleNumpad(key)}
                className="h-16 flex items-center justify-center bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] active:scale-95 active:bg-slate-100 transition-all font-title-md text-title-md text-on-background"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => handleNumpad("backspace")}
              className="h-16 flex items-center justify-center bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] active:scale-95 active:bg-slate-100 transition-all text-error"
            >
              <span className="material-symbols-outlined">backspace</span>
            </button>
          </section>

          <button className="w-full h-[56px] bg-secondary-container text-on-secondary-container rounded-full font-title-md text-title-md shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-stack-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            Process Payment
          </button>

          <div className="bg-surface-container rounded-xl p-4 flex gap-4 items-start border border-outline-variant/30">
            <div className="bg-secondary-fixed text-on-secondary-fixed w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md text-on-background mb-1">Impact</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                This payment covers the current installment and reduces the principal by $450.00.
              </p>
            </div>
          </div>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
