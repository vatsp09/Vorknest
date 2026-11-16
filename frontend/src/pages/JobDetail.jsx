import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  Clock,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { budgetText, timeAgo } from "../components/JobCard";

const LEVEL_LABELS = {
  entry: "Entry Level",
  intermediate: "Intermediate",
  expert: "Expert",
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this job.");
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 4500);
    return () => clearTimeout(timer);
  }, [flash]);

  const handleSendProposalClick = () => {
    // 1. Not logged in -> login, then come back here
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    // 2. Client mode -> not allowed
    if (user.mode !== "freelancer") {
      setFlash({
        type: "error",
        text: "Sorry, only freelancers can send proposals. Switch to Freelancer mode first.",
      });
      return;
    }
    // 3. Own job (dual-role users)
    if (job?.client?._id === user._id) {
      setFlash({ type: "error", text: "You can't send a proposal to your own job." });
      return;
    }
    setShowForm(true);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim() || !proposedRate) {
      setFlash({ type: "error", text: "Please write a cover letter and enter your rate." });
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/jobs/${id}/proposals`, {
        coverLetter,
        proposedRate: Number(proposedRate),
      });
      setApplied(true);
      setShowForm(false);
      setJob((prev) => ({ ...prev, proposalCount: (prev.proposalCount || 0) + 1 }));
      setFlash({ type: "success", text: "Proposal sent successfully! The client will review it." });
    } catch (err) {
      const message = err.response?.data?.message || "Could not send proposal.";
      if (message.toLowerCase().includes("already")) {
        setApplied(true);
        setShowForm(false);
      }
      setFlash({ type: "error", text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this job and all its proposals?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      navigate("/profile");
    } catch (err) {
      setFlash({ type: "error", text: err.response?.data?.message || "Could not delete job." });
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-400">Loading job...</div>;
  }

  if (error || !job) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">{error || "Job not found."}</p>
        <Link to="/find-work?tab=jobs" className="text-brand-600 font-semibold mt-3 inline-block">
          Back to jobs
        </Link>
      </div>
    );
  }

  const client = job.client || {};
  const isOpen = job.status === "open";
  const isOwner = user && client._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {flash && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border max-w-md ${
            flash.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {flash.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{flash.text}</span>
          <button onClick={() => setFlash(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <Link
        to="/find-work?tab=jobs"
        className="flex items-center gap-2 text-gray-500 hover:text-brand-600 text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                isOpen ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {job.status.replace("_", " ")}
            </span>
            <span>Posted {timeAgo(job.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {job.proposalCount || 0} proposal{job.proposalCount === 1 ? "" : "s"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mt-3">{job.title}</h1>

          {/* Key facts strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-brand-50 rounded-xl p-4">
              <Banknote size={18} className="text-brand-600" />
              <p className="text-xs text-gray-500 mt-2">
                {job.budgetType === "hourly" ? "Hourly Rate" : "Fixed Budget"}
              </p>
              <p className="font-bold text-gray-900">{budgetText(job)}</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <Clock size={18} className="text-brand-600" />
              <p className="text-xs text-gray-500 mt-2">Hours Expected</p>
              <p className="font-bold text-gray-900">{job.hoursPerWeek || "Flexible"}</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <CalendarDays size={18} className="text-brand-600" />
              <p className="text-xs text-gray-500 mt-2">Timeline</p>
              <p className="font-bold text-gray-900">{job.timeline || "Not specified"}</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <GraduationCap size={18} className="text-brand-600" />
              <p className="text-xs text-gray-500 mt-2">Experience</p>
              <p className="font-bold text-gray-900">
                {LEVEL_LABELS[job.experienceLevel] || "Not specified"}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">What the client expects</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tech Stack &amp; Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {(job.skillsRequired || []).length > 0 ? (
                job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No specific skills listed.</span>
              )}
            </div>
          </section>

          {/* Proposal form */}
          {showForm && !isOwner && (
            <form
              onSubmit={handleSubmitProposal}
              className="mt-10 bg-white border border-brand-200 rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Your Proposal</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {job.budgetType === "hourly" ? "Your hourly rate (₹/hr)" : "Your bid (₹)"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    placeholder={String(job.budgetMin || "")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-brand-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Client budget: {budgetText(job)}
                  {job.budgetType === "hourly" ? " per hour" : ""}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  placeholder="Introduce yourself, explain why you're a good fit, and how you'd approach this project..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl"
              >
                <Send size={16} /> {submitting ? "Sending..." : "Submit Proposal"}
              </button>
            </form>
          )}
        </div>

        {/* Right column */}
        <aside className="lg:sticky lg:top-6 h-fit space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 tracking-wide font-semibold uppercase">
              {job.budgetType === "hourly" ? "Hourly Budget" : "Project Budget"}
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{budgetText(job)}</p>
            {job.budgetType === "hourly" && <p className="text-sm text-gray-400">per hour</p>}

            {job.paymentVerified && (
              <div className="flex items-center gap-2 mt-4 text-sm text-emerald-600 font-medium">
                <ShieldCheck size={16} /> Payment Verified
              </div>
            )}

            {isOwner ? (
              <>
                <p className="text-sm text-gray-500 mt-6 bg-gray-50 rounded-xl p-3 text-center">
                  This is your job post. You can review proposals from your profile.
                </p>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3.5 rounded-xl mt-3"
                >
                  <Trash2 size={17} /> Delete This Job
                </button>
              </>
            ) : applied ? (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-semibold py-3.5 rounded-xl mt-6"
              >
                <CheckCircle2 size={17} /> Proposal Sent
              </button>
            ) : (
              <button
                onClick={handleSendProposalClick}
                disabled={!isOpen}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl mt-6"
              >
                <Send size={17} /> {isOpen ? "Send a Proposal" : "Job Closed"}
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">About the Client</p>
            <div className="flex items-center gap-3">
              <img
                src={client.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${client.name}`}
                alt={client.name}
                className="w-12 h-12 rounded-xl bg-brand-50"
              />
              <div>
                <p className="font-bold text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500">{client.title || "Client"}</p>
              </div>
            </div>
            {client.bio && <p className="text-sm text-gray-600 mt-3">{client.bio}</p>}
            {client.createdAt && (
              <p className="text-xs text-gray-400 mt-3">
                Member since {new Date(client.createdAt).getFullYear()}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetail;