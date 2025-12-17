"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const lastEmail = localStorage.getItem("last_email");
    if (lastEmail) setEmail(lastEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah. Silakan periksa kembali.");
      setLoading(false);
      return;
    }

    localStorage.setItem("last_email", email);
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1a0f0a] to-[#2b1a12]">
      <section className="w-full max-w-md px-6">
        <div className="bg-[#1f130d] border border-white/10 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              KAFE POS
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Sistem Point of Sale Kafe
            </p>
          </header>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">Email</Label>
              <Input
                type="email"
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kafe.com"
                required
                disabled={loading}
                className="h-11 bg-[#2a1b13] border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="h-11 pr-10 bg-[#2a1b13] border-white/10 text-white placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses…
                </span>
              ) : (
                "Masuk ke Sistem"
              )}
            </Button>
          </form>

          {/* Role Hint */}
          <p className="mt-6 text-center text-xs text-white/40">
            Login akan menyesuaikan peran:
            <br />
            <span className="text-white/60">Admin • Kasir • Kitchen</span>
          </p>

          {/* Micro UX */}
          <p className="mt-2 text-center text-[11px] text-white/30">
            Tekan <span className="font-medium">Enter</span> untuk masuk
          </p>
        </div>
      </section>
    </main>
  );
}
