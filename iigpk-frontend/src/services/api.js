import axios from "axios";

/**
 * ------------------------------------------------------------------
 * Backend connection — EDIT THIS FILE ONLY to match your real API.
 * ------------------------------------------------------------------
 * Set the base URL of your backend in a `.env` file at the project
 * root (see `.env.example`):
 *
 *   VITE_API_BASE_URL=http://localhost:5000
 *
 * Expected backend contract (adjust the path below if yours differs):
 *
 *   GET  {BASE_URL}/api/certificates/search/:number
 *   ->  200 OK  { number: "12345", imgUrl: "https://..." }
 *   ->  404     { message: "Certificate not found" }
 *
 * This matches a Mongoose schema with just two fields: `number` and
 * `imgUrl`.
 * ------------------------------------------------------------------
 */

// Fallback to localhost if the environment variable is missing (good for local dev)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Look up a certificate by its number.
 * Returns the certificate object { number, imgUrl } or throws.
 */
export async function getCertificateByNumber(number) {
  const cleaned = String(number).trim();
  if (!cleaned) throw new Error("Please enter a certificate number.");

  const { data } = await api.get(`/api/certificates/search/${encodeURIComponent(cleaned)}`);

  // Be tolerant of slightly different response shapes from the backend.
  const record = data?.certificate || data?.data || data;
  if (!record || (!record.imgUrl && !record.image)) {
    throw new Error("No certificate found for that number.");
  }
  return {
    number: record.number ?? cleaned,
    imgUrl: record.imgUrl || record.image,
  };
}

export default api;
