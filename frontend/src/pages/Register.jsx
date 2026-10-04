import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", mode: "freelancer" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3"
          required
        />
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

        <div className="flex gap-3">
          {["freelancer", "client"].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setForm({ ...form, mode: m })}
              className={`flex-1 py-3 rounded-xl font-medium capitalize border ${
                form.mode === m
                  ? "bg-brand-600 text-white border-brand-600"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              I'm a {m}
            </button>
          ))}
        </div>

        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl">
          Sign Up
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-600 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
