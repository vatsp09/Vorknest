import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Log In</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3"
          required
        />
        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl">
          Log In
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        No account?{" "}
        <Link to="/register" className="text-brand-600 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
