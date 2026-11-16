import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const INDUSTRIES = ["Technology", "Marketing", "E-commerce", "Education", "Finance", "Other"];

const BecomeClient = () => {
  const { user, switchMode } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    industry: INDUSTRIES[0],
    location: "",
    about: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Guard: must be logged in, and only freelancers need this form
  useEffect(() => {
    if (!user) navigate("/login", { state: { from: "/become-client" } });
    else if (user.mode === "client") navigate("/profile", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleContinue = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await switchMode(); // freelancer -> client
      navigate("/profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
          <Building2 size={22} />
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">Client Profile</h1>
      </div>
      <p className="text-gray-500 mt-3">
        Tell us a little about you or your company so freelancers know who they're working with.
      </p>

      <form
        onSubmit={handleContinue}
        className="mt-8 bg-white border border-gray-100 rounded-2xl p-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company / Business Name
          </label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g. TechNova Solutions"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <select
            name="industry"
            value={form.industry}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Bhopal, India"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={4}
            placeholder="What kind of work do you usually hire for?"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl"
        >
          {submitting ? "Switching..." : "Continue"} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default BecomeClient;