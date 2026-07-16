import { useState } from "react";
import { getCertificateByNumber } from "../services/api";

export default function CertificateSearch() {
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!number.trim()) {
      setStatus("error");
      setError("Enter a certificate number to search.");
      return;
    }
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const cert = await getCertificateByNumber(number);
      setResult(cert);
      setStatus("success");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  function handleReset() {
    setNumber("");
    setResult(null);
    setStatus("idle");
    setError("");
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 bg-ivory/95 rounded-xl p-2 shadow-card ring-1 ring-stone-900/5"
      >
        <label htmlFor="cert-number" className="sr-only">
          Certificate number
        </label>
        <input
          id="cert-number"
          type="text"
          inputMode="numeric"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter certificate number, e.g. 10234"
          className="flex-1 bg-transparent px-4 py-3 text-stone-900 placeholder:text-stone-600/50 focus:outline-none font-body"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-ivory font-semibold text-sm tracking-wide px-6 py-3 transition-colors"
        >
          {status === "loading" ? "Searching…" : "Verify"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-100 bg-red-900/80 rounded-md px-4 py-2">
          {error}
        </p>
      )}

      {status === "success" && result && (
        <div className="mt-6 bg-ivory rounded-2xl shadow-card ring-1 ring-stone-900/5 overflow-hidden animate-[fadeIn_.3s_ease]">
          <div className="flex items-center justify-between px-5 py-3 bg-emerald-950 text-ivory">
            <span className="font-display text-lg tracking-wide">
              Certificate #{result.number}
            </span>
            <button
              onClick={handleReset}
              className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300"
            >
              New search
            </button>
          </div>
          <img
            src={result.imgUrl}
            alt={`Certificate ${result.number}`}
            className="w-full max-h-[520px] object-contain bg-stone-900/5"
          />
        </div>
      )}
    </div>
  );
}
