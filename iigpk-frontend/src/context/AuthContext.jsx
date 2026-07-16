import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "iigpk_admin_session";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore a saved session on first load.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setToken(saved.token);
        setAdmin(saved.admin);
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setLoading(false);
    }
  }, []);

  async function login(adminId, password) {
    const { data } = await api.post("/api/admin/login", { adminId, password });
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function logout() {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  /** The current JWT, to send as a Bearer token to the backend. */
  async function getToken() {
    return token;
  }

  return (
    <AuthContext.Provider value={{ user: admin, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
