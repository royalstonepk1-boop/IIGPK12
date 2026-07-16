import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      
      await login(adminId, password);
      const dest = location.state?.from?.pathname || "/admin";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't sign in — check your admin ID and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-ivory rounded-2xl shadow-card ring-1 ring-stone-900/5 p-8">
        <h1 className="font-display text-3xl text-emerald-950 mb-1 text-center">
          Admin Sign In
        </h1>
        <p className="text-sm text-stone-600 text-center mb-6">
          Certificate management portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-600 mb-1.5">
              Admin ID
            </label>
            <input
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full rounded-lg border border-stone-900/10 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500/60"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-900/10 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500/60"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-100 rounded-md px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-ivory font-semibold text-sm tracking-wide px-6 py-3 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
