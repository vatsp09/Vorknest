import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vorknest_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const persist = (data) => {
    localStorage.setItem("vorknest_user", JSON.stringify(data));
    setUser(data);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persist(data);
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("vorknest_user");
    setUser(null);
  };

  const switchMode = async () => {
    const { data } = await api.put("/auth/mode");
    const updated = { ...user, mode: data.mode };
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, switchMode, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);