"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { storeToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type AuthPageProps = {
  initialMode: "login" | "register";
};

export function AuthPage({ initialMode }: AuthPageProps) {
  const router = useRouter();
  const mode = initialMode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        const registerRes = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });

        if (!registerRes.ok) {
          const payload = await registerRes.json();
          throw new Error(payload.detail || "Failed to register user");
        }
      }

      const body = new URLSearchParams();
      body.set("username", email);
      body.set("password", password);

      const loginRes = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!loginRes.ok) {
        const payload = await loginRes.json();
        throw new Error(payload.detail || "Invalid credentials");
      }

      const tokenPayload = await loginRes.json();
      storeToken(tokenPayload.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-panel">
        <h1 className="text-3xl font-bold text-ink">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-2 text-sm text-slate/80">Sign in to access Enerluma analytics.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3"
              placeholder="Full name"
              required
            />
          ) : null}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate/20 px-4 py-3"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate/20 px-4 py-3"
            placeholder="Password"
            minLength={8}
            required
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ocean px-4 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register & Login"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link href={mode === "login" ? "/register" : "/login"} className="font-medium text-ocean">
            {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
          </Link>
        </div>
      </div>
    </main>
  );
}
