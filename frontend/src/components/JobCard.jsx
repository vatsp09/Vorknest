import { Link } from "react-router-dom";
import { ShieldCheck, Clock, Users, ArrowRight } from "lucide-react";

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day(s) ago`;
};

export const budgetText = (job) =>
  job.budgetType === "hourly"
    ? `${formatINR(job.budgetMin)} - ${formatINR(job.budgetMax)}`
    : formatINR(job.budgetMin);

const JobCard = ({ job }) => {
  const clientName = job.client?.name || "Client";

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group flex flex-col md:flex-row gap-5 bg-white border border-gray-100 border-l-4 border-l-brand-500 rounded-xl p-5 hover:shadow-lg hover:border-brand-200 transition"
    >
      {/* Left: main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
            {clientName.charAt(0)}
          </span>
          <span className="font-medium text-gray-600">{clientName}</span>
          <span>• Posted {timeAgo(job.createdAt)}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-brand-600">
          {job.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {(job.skillsRequired || []).slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs bg-brand-50 text-brand-700 font-medium px-2.5 py-1 rounded-md">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
          {job.paymentVerified && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck size={14} /> Payment Verified
            </span>
          )}
          {job.hoursPerWeek && (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {job.hoursPerWeek}
            </span>
          )}
          <span className="flex items-center gap-1 capitalize">
            <Users size={14} /> {job.experienceLevel || "intermediate"} level
          </span>
        </div>
      </div>

      {/* Right: budget panel */}
      <div className="md:w-52 shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:border-l md:border-gray-100 md:pl-5">
        <div className="md:text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
            {job.budgetType === "hourly" ? "Hourly Rate" : "Fixed Budget"}
          </p>
          <p className="text-xl font-extrabold text-gray-900">{budgetText(job)}</p>
          {job.budgetType === "hourly" && <p className="text-xs text-gray-400">per hour</p>}
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
          View Job <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
};

export default JobCard;