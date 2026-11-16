import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Pencil, Plus, X, Check, Send, Undo2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import GigCard from "../components/GigCard";
import ProposalStatusBadge from "../components/ProposalStatusBadge";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const FreelancerProfile = () => {
  const { user, setUser } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", bio: "", hourlyRate: "", skills: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        title: user.title || "",
        bio: user.bio || "",
        hourlyRate: user.hourlyRate || "",
        skills: (user.skills || []).join(", "),
      });
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const [gigsRes, proposalsRes] = await Promise.all([
        api.get("/gigs"),
        api.get("/proposals/mine"),
      ]);
      setGigs(gigsRes.data.filter((g) => g.freelancer?._id === user._id));
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
        hourlyRate: Number(form.hourlyRate) || 0,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
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

    const handleDeleteGig = async (gigId) => {
    if (!window.confirm("Delete this gig permanently?")) return;
    await api.delete(`/gigs/${gigId}`);
    setGigs((prev) => prev.filter((g) => g._id !== gigId));
  };

  const handleWithdraw = async (proposalId) => {
    if (!window.confirm("Withdraw this proposal?")) return;
    await api.delete(`/proposals/${proposalId}`);
    setProposals((prev) => prev.filter((p) => p._id !== proposalId));
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
      {/* Profile header card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col md:flex-row md:items-start gap-8">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
          alt={user.name}
          className="w-28 h-28 rounded-2xl object-cover bg-brand-50"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
              {!editing ? (
                <p className="text-brand-600 font-medium mt-1">
                  {user.title || "Add a professional title"}
                </p>
              ) : (
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Full Stack Developer"
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

          <div className="flex items-center gap-5 mt-4 text-sm">
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <Star size={15} className="fill-yellow-400 text-yellow-400" />
              {user.rating?.toFixed(1) || "New"}{" "}
              <span className="text-gray-400 font-normal">({user.reviewCount || 0} reviews)</span>
            </span>
            <span className="text-gray-300">|</span>
            {!editing ? (
              <span className="font-semibold text-gray-800">
                {inr(user.hourlyRate)}
                <span className="text-gray-400 font-normal">/hr</span>
              </span>
            ) : (
              <input
                type="number"
                value={form.hourlyRate}
                onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                placeholder="Hourly rate (INR)"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32"
              />
            )}
          </div>

          {!editing ? (
            <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl">
              {user.bio || "Tell clients about yourself, your experience, and what makes you great to work with."}
            </p>
          ) : (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Write a short bio..."
              className="mt-4 w-full max-w-2xl border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          )}

          <div className="flex flex-wrap gap-2 mt-5">
            {!editing ? (
              (user.skills || []).length > 0 ? (
                user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-brand-100 text-brand-700 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No skills added yet.</span>
              )
            ) : (
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="Skills, comma separated (e.g. React, Node.js, Figma)"
                className="w-full max-w-2xl border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* My proposals */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Send size={22} className="text-brand-600" /> My Proposals
            {pendingCount > 0 && (
              <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                {pendingCount} awaiting
              </span>
            )}
          </h2>
          <Link to="/find-work?tab=jobs" className="text-brand-600 font-semibold text-sm">
            Browse jobs →
          </Link>
        </div>

        <div className="space-y-3 mt-6">
          {proposals.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                {p.job ? (
                  <Link
                    to={`/jobs/${p.job._id}`}
                    className="font-semibold text-gray-800 hover:text-brand-600"
                  >
                    {p.job.title}
                  </Link>
                ) : (
                  <p className="font-semibold text-gray-400">Job no longer available</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {p.job?.client?.name && <>Client: {p.job.client.name} • </>}
                  Your bid: <span className="font-medium text-gray-700">{inr(p.proposedRate)}</span> •
                  Sent {new Date(p.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
                 <div className="flex items-center gap-3">
                <ProposalStatusBadge status={p.status} />
                {p.status === "pending" && (
                  <button
                    onClick={() => handleWithdraw(p._id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full"
                  >
                    <Undo2 size={13} /> Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
          {proposals.length === 0 && (
            <p className="text-gray-400">
              You haven't sent any proposals yet. Find a job and send your first one.
            </p>
          )}
        </div>
      </div>

      {/* My gigs */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Gigs</h2>
          <Link
            to="/post-gig"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl"
          >
            <Plus size={17} /> Create New Gig
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {gigs.map((gig) => (
             <GigCard key={gig._id} gig={gig} onDelete={handleDeleteGig} />
          ))}
          {gigs.length === 0 && (
            <p className="text-gray-400 col-span-full">
              You haven't posted any gigs yet — create your first one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;