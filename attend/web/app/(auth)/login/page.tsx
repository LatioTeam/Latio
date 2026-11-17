// S15-auth — Đăng nhập admin web
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === "email") {
      if (!email.includes("@")) { setError("Email không hợp lệ."); return; }
      setStep("otp");
      return;
    }
    if (otp.length !== 6) { setError("OTP gồm 6 chữ số."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-bg-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-card bg-accent items-center justify-center mb-4">
            <span className="text-on-accent text-2xl font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold text-text">LATIO Admin</h1>
          <p className="text-sm text-text-muted mt-1">Quản lý chấm công & nhân sự</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg rounded-card shadow-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">
            {step === "email" ? "Đăng nhập" : "Xác minh OTP"}
          </h2>

          {step === "email" ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@latio.vn"
                className="w-full h-10 border border-border-input rounded-sm px-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                autoFocus
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Mã OTP gửi đến {email}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full h-10 border border-border-input rounded-sm px-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                autoFocus
              />
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-accent text-on-accent rounded-pill font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 transition-colors"
          >
            {loading ? "Đang xử lý..." : step === "email" ? "Tiếp tục" : "Đăng nhập"}
          </button>

          {step === "otp" && (
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-accent font-medium hover:underline"
            >
              Quay lại
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
