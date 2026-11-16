import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, X, Check, Briefcase, ShieldCheck, Inbox, Star, Trash2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProposalStatusBadge from "../components/ProposalStatusBadge";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const ClientProfile = () => {
  const { user, setUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ title: user.title || "", bio: user.bio || "" });
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const [jobsRes, proposalsRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/proposals/received"),
      ]);
      setJobs(jobsRes.data.filter((j) => j.client?._id === user._id));
      setProposals(proposalsRes.data);
    };
    loadData();
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

  const handleProposalStatus = async (proposalId, status) => {
    setUpdatingId(proposalId);
    try {
      await api.put(`/proposals/${proposalId}`, { status });
      setProposals((prev) => prev.map((p) => (p._id === proposalId ? { ...p, status } : p)));
      if (status === "accepted") {
        const accepted = proposals.find((p) => p._id === proposalId);
        setJobs((prev) =>
          prev.map((j) => (j._id === accepted?.job?._id ? { ...j, status: "in_progress" } : j))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job and all its proposals?")) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    setProposals((prev) => prev.filter((p) => p.job?._id !== jobId));
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

  const pendingCount = proposals.filter((p) => p.status === "pending").length;

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
                <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-2 py-1 rounded-full">
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
            <span className="flex items-center gap-1">
              <Inbox size={15} /> {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} received
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

      {/* Proposals received */}
      <div className="mt-10">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Inbox size={22} className="text-brand-600" /> Proposals Received
          {pendingCount > 0 && (
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
              {pendingCount} new
            </span>
          )}
        </h2>

        <div className="space-y-4 mt-6">
          {proposals.map((p) => {
            const f = p.freelancer || {};
            return (
              <div key={p._id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={f.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${f.name}`}
                      alt={f.name}
                      className="w-12 h-12 rounded-xl bg-brand-50"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{f.name}</p>
                      <p className="text-sm text-brand-600">{f.title || "Freelancer"}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {f.rating?.toFixed(1) || "New"} ({f.reviewCount || 0} reviews)
                      </p>
                    </div>
                  </div>
                  <ProposalStatusBadge status={p.status} />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  For job:{" "}
                  {p.job ? (
                    <Link to={`/jobs/${p.job._id}`} className="font-semibold text-gray-800 hover:text-brand-600">
                      {p.job.title}
                    </Link>
                  ) : (
                    "Job removed"
                  )}{" "}
                  • Bid: <span className="font-semibold text-gray-800">{inr(p.proposedRate)}</span> • Received{" "}
                  {new Date(p.createdAt).toLocaleDateString("en-IN")}
                </p>

                <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-xl p-3 whitespace-pre-line">
                  {p.coverLetter}
                </p>

                {p.status === "pending" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleProposalStatus(p._id, "accepted")}
                      disabled={updatingId === p._id}
                      className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      <Check size={15} /> Accept
                    </button>
                    <button
                      onClick={() => handleProposalStatus(p._id, "rejected")}
                      disabled={updatingId === p._id}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {proposals.length === 0 && (
            <p className="text-gray-400">
              No proposals yet. They'll show up here as soon as freelancers apply to your jobs.
            </p>
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
            <Link
              to={`/jobs/${job._id}`}
              key={job._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition"
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
                      ? `${inr(job.budgetMin)}-${inr(job.budgetMax)}/hr`
                      : `Fixed: ${inr(job.budgetMin)}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full capitalize">
                  {job.status.replace("_", " ")}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteJob(job._id);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </Link>
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