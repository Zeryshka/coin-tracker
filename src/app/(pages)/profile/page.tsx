"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === "visible" && update();
    window.addEventListener("visibilitychange", visibilityHandler, false);
    return () => window.removeEventListener("visibilitychange", visibilityHandler, false);
  }, [update]);

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
