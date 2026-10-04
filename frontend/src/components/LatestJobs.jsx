import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck, SlidersHorizontal, ExternalLink } from "lucide-react";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const JobItem = ({ job }) => {
  const budgetLabel =
    job.budgetType === "hourly"
      ? `Hourly: ${formatINR(job.budgetMin)} - ${formatINR(job.budgetMax)}/hr`
      : `Fixed: ${formatINR(job.budgetMin)}`;

  return (
    <div className="pb-5 border-b border-gray-100 last:border-0">
      <Link to={`/jobs/${job._id}`} className="font-semibold text-gray-800 hover:text-brand-600">
        {job.title}
      </Link>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm text-gray-500">
        {job.paymentVerified && (
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck size={14} /> Payment Verified
          </span>
        )}
        <span>• {budgetLabel}</span>
        {job.hoursPerWeek && <span>• {job.hoursPerWeek}</span>}
      </div>
      <div className="flex gap-2 mt-2">
        {(job.skillsRequired || []).slice(0, 2).map((skill) => (
          <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const LatestJobs = ({ jobs }) => {
  return (
    <aside className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
          <Briefcase size={18} className="text-brand-600" /> Latest Jobs
        </h3>
        <SlidersHorizontal size={16} className="text-gray-400" />
      </div>

      <div className="space-y-5">
        {jobs.map((job) => (
          <JobItem key={job._id} job={job} />
        ))}
      </div>

      <Link
        to="/find-work?tab=jobs"
        className="mt-6 w-full flex items-center justify-center gap-1 bg-brand-50 text-brand-700 font-semibold py-3 rounded-xl hover:bg-brand-100"
      >
        View All Matches <ExternalLink size={14} />
      </Link>
    </aside>
  );
};

export default LatestJobs;