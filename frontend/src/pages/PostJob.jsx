import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Banknote,
  Clock,
  ShieldCheck,
  Search,
  X,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level", desc: "Looking for someone relatively new" },
  { value: "intermediate", label: "Intermediate", desc: "Looking for substantial experience" },
  { value: "expert", label: "Expert", desc: "Looking for comprehensive expertise" },
];

const TIMELINES = ["Less than 1 month", "1-3 months", "3-6 months", "6+ months"];

const MAX_SKILLS = 5;

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("fixed"); // "fixed" | "hourly"
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [maxBudget, setMaxBudget] = useState("");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addSkill = (skill) => {
    const clean = skill.trim();
    if (!clean || skills.includes(clean) || skills.length >= MAX_SKILLS) return;
    setSkills([...skills, clean]);
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const buildPayload = () => ({
    title,
    description,
    skillsRequired: skills,
    budgetType: projectType,
    budgetMin: Number(maxBudget) || 0,
    budgetMax: Number(maxBudget) || 0,
    hoursPerWeek: projectType === "hourly" ? timeline : "",
  });

  const handlePost = async () => {
    if (!user) return setError("Please log in to post a job.");
    if (!title || !description || !maxBudget) {
      return setError("Please fill in job title, description, and budget.");
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/jobs", buildPayload());
      navigate("/find-work?tab=jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Draft persistence can hook into a /api/jobs?status=draft endpoint later.
    console.log("Draft saved", buildPayload());
  };

  const summaryTitle = title || "Untitled job";
  const summaryBudget =
    projectType === "fixed"
      ? `₹${Number(maxBudget || 0).toLocaleString("en-IN")} (Fixed Price)`
      : `₹${Number(maxBudget || 0).toLocaleString("en-IN")}/hr (Hourly)`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold tracking-wide px-3 py-1 rounded-full">
        NEW POST
      </span>
      <h1 className="text-5xl font-extrabold text-gray-900 mt-3">Create a Job Posting</h1>
      <p className="text-gray-500 text-lg mt-3 max-w-xl">
        Attract top-tier freelance talent by providing clear, detailed requirements for your
        project.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1 */}
          <section className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm flex items-center justify-center font-bold">
                1
              </span>
              Basic Details
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Full Stack Developer for FinTech Dashboard"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
            />
            <div className="flex justify-between mt-2 mb-6">
              <span className="text-sm text-gray-500">A specific title attracts better candidates.</span>
              <span className="text-sm text-gray-400">{title.length}/80</span>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project goals, deliverables, and any specific requirements..."
              rows={7}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 resize-y"
            />
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm flex items-center justify-center font-bold">
                2
              </span>
              Scope &amp; Budget
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Project Type</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProjectType("fixed")}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-xl border font-semibold ${
                      projectType === "fixed"
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    <Banknote size={20} />
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType("hourly")}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-xl border font-semibold ${
                      projectType === "hourly"
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    <Clock size={20} />
                    Hourly
                  </button>
                </div>

                <p className="text-sm font-medium text-gray-700 mt-6 mb-2">
                  Maximum Budget (INR)
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="500000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Experience Level</p>
                <div className="space-y-3">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer ${
                        experienceLevel === level.value
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        checked={experienceLevel === level.value}
                        onChange={() => setExperienceLevel(level.value)}
                        className="mt-1 accent-brand-600"
                      />
                      <span>
                        <span className="block font-medium text-gray-800">{level.label}</span>
                        <span className="block text-sm text-gray-500">{level.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <p className="text-sm font-medium text-gray-700 mt-6 mb-2">Expected Timeline</p>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
                >
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm flex items-center justify-center font-bold">
                3
              </span>
              Required Skills
            </h2>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Search for skills (e.g., React, UI Design, Copywriting)..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-500"
              />
            </div>

            <p className="text-sm text-gray-500 mt-5 mb-2">Selected Skills (Max {MAX_SKILLS})</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 bg-brand-100 text-brand-700 font-medium px-3 py-1.5 rounded-full"
                >
                  {skill.toUpperCase()}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              {skills.length === 0 && <span className="text-gray-400 text-sm">No skills added yet.</span>}
            </div>
          </section>
        </div>

        {/* Right: sticky summary */}
        <aside className="lg:sticky lg:top-6 h-fit">
          <div className="bg-ink rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <h3 className="text-white text-xl font-bold">Job Summary</h3>
              <p className="text-gray-400 text-sm mt-1">Review your post details</p>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="flex items-start gap-3">
                <Briefcase size={18} className="text-brand-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 tracking-wide font-semibold">TITLE</p>
                  <p className="text-white font-medium mt-1 line-clamp-2">{summaryTitle}</p>
                </div>
              </div>
              <div className="border-t border-white/10" />

              <div className="flex items-start gap-3">
                <Banknote size={18} className="text-brand-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 tracking-wide font-semibold">BUDGET &amp; TYPE</p>
                  <p className="text-white font-medium mt-1">{summaryBudget}</p>
                </div>
              </div>
              <div className="border-t border-white/10" />

              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-brand-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 tracking-wide font-semibold">SKILLS REQUIRED</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {skills.length === 0 && <span className="text-gray-500 text-sm">None yet</span>}
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-semibold bg-white/10 text-white px-2 py-1 rounded-md"
                      >
                        {skill.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            onClick={handlePost}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl mt-4"
          >
            {submitting ? "Posting..." : "Post Job Now"} <ArrowRight size={18} />
          </button>
          <button
            onClick={handleSaveDraft}
            className="w-full text-brand-600 font-semibold py-3"
          >
            Save as Draft
          </button>
        </aside>
      </div>
    </div>
  );
};

export default PostJob;