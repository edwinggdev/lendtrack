"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

type Alert = {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  actions?: string[];
};

const alerts: Alert[] = [
  {
    type: "success",
    title: "Payment processed successfully",
    message: "Loan repayment of $1,250.00 for Client #8821 has been cleared and ledger updated.",
    actions: ["View Receipt"],
  },
  {
    type: "warning",
    title: "Client has 3 overdue payments",
    message: "Marco Rossi (ID: 442) has exceeded the grace period. Immediate follow-up required to avoid default status.",
    actions: ["Call Client", "Send Notice"],
  },
  {
    type: "error",
    title: "Transaction failed",
    message: "The disbursement to Bank Account ending in ••••9012 was rejected by the receiving institution (Error Code: 504).",
    actions: ["Retry Transaction"],
  },
  {
    type: "info",
    title: "System maintenance tonight",
    message: "LendTrack will be offline for scheduled database optimization between 02:00 AM and 04:00 AM EST.",
    actions: ["Learn More"],
  },
];

const alertStyles = {
  success: {
    bg: "bg-[#ecfdf5]",
    border: "border-success",
    text: "text-[#065f46]",
    icon: "check_circle",
    iconColor: "text-success",
  },
  warning: {
    bg: "bg-[#fffbeb]",
    border: "border-warning",
    text: "text-[#92400e]",
    icon: "warning",
    iconColor: "text-warning",
  },
  error: {
    bg: "bg-error-container",
    border: "border-error",
    text: "text-on-error-container",
    icon: "error",
    iconColor: "text-error",
  },
  info: {
    bg: "bg-surface-container-high",
    border: "border-secondary",
    text: "text-on-secondary-fixed-variant",
    icon: "info",
    iconColor: "text-secondary",
  },
};

export default function AlertsPage() {
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  function handleAction(alertIdx: number, actionIdx: number, label: string) {
    const key = `${alertIdx}-${actionIdx}`;
    setProcessing((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setProcessing((prev) => ({ ...prev, [key]: false }));
    }, 1200);
  }

  return (
    <>
      <TopAppBar />
      <main className="max-w-md mx-auto px-margin-mobile pt-stack-lg flex flex-col gap-stack-lg pb-32">
        <section className="flex flex-col gap-base">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Notification Center</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Review recent system updates and critical loan status alerts.
          </p>
        </section>

        <div className="flex flex-col gap-stack-md">
          {alerts.map((alert, i) => {
            const style = alertStyles[alert.type];
            return (
              <div key={i} className="animate-[slideIn_0.4s_ease-out_forwards]" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                <div className={`${style.bg} border-l-4 ${style.border} p-5 rounded-lg shadow-[0_4px_12px_rgba(15,23,42,0.08)] flex items-start gap-4`}>
                  <div className={`${style.iconColor} mt-1`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {style.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-title-md text-title-md ${style.text}`}>{alert.title}</h3>
                    <p className={`font-body-md text-body-md ${style.text} mt-1 opacity-90`}>{alert.message}</p>
                    <div className="flex gap-4 mt-stack-sm">
                      {alert.actions?.map((action, j) => {
                        const key = `${i}-${j}`;
                        const isProcessing = processing[key];
                        return (
                          <button
                            key={j}
                            onClick={() => handleAction(i, j, action)}
                            disabled={isProcessing}
                            className={`font-label-md text-label-md ${style.iconColor} uppercase font-bold tracking-wider hover:underline disabled:opacity-50`}
                          >
                            {isProcessing ? (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                                Processing...
                              </span>
                            ) : (
                              action
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
