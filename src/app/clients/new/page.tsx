"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { createClient } from "@/app/actions";

export default function NewClient() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientName, setClientName] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    let valid = true;
    inputs.forEach((input) => {
      if (!input.value) {
        input.closest(".field-group")?.classList.add("border-error");
        valid = false;
      } else {
        input.closest(".field-group")?.classList.remove("border-error");
      }
    });
    if (!valid) return;

    setPending(true);
    const fd = new FormData(form);
    await createClient(fd);
    const nameInput = form.querySelector<HTMLInputElement>("#full_name");
    setClientName(nameInput?.value || "Client");
    setShowSuccess(true);
    setPending(false);
    form.reset();
  }

  return (
    <>
      <TopAppBar />
      <main className="max-w-md mx-auto px-margin-mobile py-stack-lg pb-32">
        <section className="mb-stack-lg">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Register New Client</h2>
          <p className="font-body-md text-on-surface-variant">Provide the details below to add a new borrower.</p>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.08)] space-y-stack-md">
            <div className="space-y-1 field-group">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="full_name">
                Full Name
              </label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">person</span>
                <input
                  className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-1 field-group">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">call</span>
                <input
                  className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
              </div>
            </div>

            <div className="space-y-1 field-group">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="id_number">
                ID Number
              </label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">badge</span>
                <input
                  className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                  id="id_number"
                  name="id_number"
                  placeholder="ID-00000000"
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-1 field-group">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="address">
                Residential Address
              </label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-4 top-4 material-symbols-outlined text-outline">location_on</span>
                <textarea
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant resize-none"
                  id="address"
                  name="address"
                  placeholder="123 Financial Way, Suite 400..."
                  rows={3}
                />
              </div>
            </div>

            <div className="pt-stack-md">
              <button
                type="submit"
                disabled={pending}
                className="w-full h-touch-target bg-secondary text-on-secondary rounded-lg font-title-md text-title-md hover:bg-on-secondary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">how_to_reg</span>
                {pending ? "Saving..." : "Save Client"}
              </button>
            </div>
          </div>
        </form>

        <section className="mt-stack-lg p-margin-mobile border border-dashed border-outline-variant rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-secondary">help_outline</span>
          </div>
          <div>
            <h4 className="font-title-md text-on-surface">Need help?</h4>
            <p className="font-body-md text-on-surface-variant">Tap for guidance on data security and client privacy standards.</p>
          </div>
        </section>
      </main>
      <BottomNavBar />

      {showSuccess && (
        <div
          className="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-margin-mobile"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl p-stack-lg w-full max-w-xs text-center scale-100 opacity-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-stack-md">
              <span
                className="material-symbols-outlined text-[40px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Client Saved</h3>
            <p className="font-body-md text-on-surface-variant mb-stack-lg">
              {clientName} has been successfully added to your client list.
            </p>
            <button
              className="w-full h-touch-target bg-primary text-on-primary rounded-lg font-title-md"
              onClick={() => {
                setShowSuccess(false);
                router.push("/clients");
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
