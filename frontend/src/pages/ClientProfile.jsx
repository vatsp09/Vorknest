import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, X, Check, Briefcase, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ClientProfile = () => {
  const { user, setUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        title: user.title || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadMyJobs = async () => {
      if (!user) return;
      const { data } = await api.get("/jobs");
      setJobs(data.filter((j) => j.client?._id === user._id));
    };
    loadMyJobs();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/auth/profile", {
        title: form.title,
        bio: form.bio,
      });
      const stored = JSON.parse(localStorage.getItem("vorknest_user"));
      const updated = { ...stored, ...data };
      localStorage.setItem("vorknest_user", JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
        <Link to="/login" className="text-brand-600 font-semibold mt-2 inline-block">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Basic details card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col md:flex-row md:items-start gap-8">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
          alt={user.name}
          className="w-28 h-28 rounded-2xl object-cover bg-brand-50"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
                <span className="flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-100 px-2 py-1 rounded-full">
                  Client
                </span>
              </div>
              {!editing ? (
                <p className="text-gray-500 mt-1">
                  {user.title || "Add a company name or role (e.g. FinTech Startup)"}
                </p>
              ) : (
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. FinTech Startup"
                  className="mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm w-72"
                />
              )}
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                <Pencil size={15} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-brand-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-brand-700 disabled:opacity-60"
                >
                  <Check size={15} /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl"
                >
                  <X size={15} /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Briefcase size={15} /> {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </span>
            <span className="text-gray-300">|</span>
            <span>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
          </div>

          {!editing ? (
            <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl">
              {user.bio || "Tell freelancers a bit about your company and the kind of work you post."}
            </p>
          ) : (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Write a short company/about description..."
              className="mt-4 w-full max-w-2xl border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          )}
        </div>
      </div>

      {/* Posted jobs */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Job Posts</h2>
          <Link
            to="/hire"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl"
          >
            <Plus size={17} /> Post a New Job
          </Link>
        </div>

        <div className="space-y-4 mt-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">{job.title}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  {job.paymentVerified && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <ShieldCheck size={14} /> Payment Verified
                    </span>
                  )}
                  <span>
                    •{" "}
                    {job.budgetType === "hourly"
                      ? `₹${job.budgetMin?.toLocaleString("en-IN")}-₹${job.budgetMax?.toLocaleString("en-IN")}/hr`
                      : `Fixed: ₹${job.budgetMin?.toLocaleString("en-IN")}`}
                  </span>
                  <span className="capitalize">• {job.status.replace("_", " ")}</span>
                </div>
              </div>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full capitalize">
                {job.status.replace("_", " ")}
              </span>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-gray-400">You haven't posted any jobs yet — create your first one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;