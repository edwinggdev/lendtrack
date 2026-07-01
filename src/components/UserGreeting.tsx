"use client";

import { useAuth } from "./AuthProvider";

export default function UserGreeting() {
  const { user } = useAuth();
  return <p className="font-body-lg text-body-lg text-on-surface-variant">Buen dia, {user?.nombre || "Usuario"}</p>;
}
