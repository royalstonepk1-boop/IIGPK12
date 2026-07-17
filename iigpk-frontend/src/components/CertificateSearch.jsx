import { useEffect, useRef, useState } from "react";
import { getCertificateByNumber } from "../services/api";

const NUMBER_MAX_LENGTH = 10;
const DEBOUNCE_MS = 500;

export default function CertificateSearch() {
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  async function runSearch(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      setStatus("idle");
      setError("");
      setResult(null);
      return;
    }
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const cert = await getCertificateByNumber(trimmed);
      setResult(cert);
      setStatus("success");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  // Debounce: auto-search a moment after the user stops typing.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!number.trim()) {
      setStatus("idle");
      setError("");
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      runSearch(number);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  function handleChange(e) {
    // Convert to uppercase before it's ever sent to the backend.
    setNumber(e.target.value.toUpperCase());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!number.trim()) {
      setStatus("error");
      setError("Enter a certificate number to search.");
      return;
    }
    runSearch(number);
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setNumber("");
    setResult(null);
    setStatus("idle");
    setError("");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 bg-ivory/95 rounded-xl p-2 shadow-card ring-1 ring-stone-900/5"
      >
        <label htmlFor="cert-number" className="sr-only">
          Certificate number
        </label>
        <div className="relative flex-1">
          <input
            id="cert-number"
            type="text"
            inputMode="numeric"
            maxLength={NUMBER_MAX_LENGTH}
            value={number}
            onChange={handleChange}
            placeholder="Enter certificate number"
            className="w-full bg-transparent px-4 py-3 pr-9 text-stone-900 placeholder:text-stone-600/50 focus:outline-none font-body"
          />
          {number && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-stone-900/10 text-stone-700 text-xs font-bold flex items-center justify-center hover:bg-stone-900/20 transition-colors"
            >
              ×
            </button>
          )}
        </div>
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
              Certificate <span className="font-body text-md">#{result.number}</span>
            </span>
            <button
              onClick={handleClear}
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