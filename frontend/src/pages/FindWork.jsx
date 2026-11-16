import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import GigCard from "../components/GigCard";
import JobCard from "../components/JobCard";

const FindWork = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [tab, setTab] = useState(searchParams.get("tab") === "jobs" ? "jobs" : "gigs");
  const [typeFilter, setTypeFilter] = useState("all");
  const [gigs, setGigs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const [gigsRes, jobsRes] = await Promise.all([api.get(`/gigs${q}`), api.get(`/jobs${q}`)]);
      setGigs(gigsRes.data);
      setJobs(jobsRes.data);
    };
    load();
  }, [search]);

  const visibleJobs = jobs.filter((j) => typeFilter === "all" || j.budgetType === typeFilter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        {search ? `Results for "${search}"` : "Find Work"}
      </h1>

      <div className="flex gap-6 mt-6 border-b border-gray-200">
        <button
          onClick={() => setTab("gigs")}
          className={`pb-3 font-semibold ${
            tab === "gigs" ? "text-brand-600 border-b-2 border-brand-600" : "text-gray-400"
          }`}
        >
          Gigs / Services
        </button>
        <button
          onClick={() => setTab("jobs")}
          className={`pb-3 font-semibold ${
            tab === "jobs" ? "text-brand-600 border-b-2 border-brand-600" : "text-gray-400"
          }`}
        >
          Job Posts ({jobs.length})
        </button>
      </div>

      {tab === "gigs" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
          {gigs.length === 0 && <p className="text-gray-400">No gigs found.</p>}
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex gap-2 mb-5">
            {[
              { v: "all", l: "All Jobs" },
              { v: "fixed", l: "Fixed Price" },
              { v: "hourly", l: "Hourly" },
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => setTypeFilter(f.v)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                  typeFilter === f.v
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {visibleJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
            {visibleJobs.length === 0 && <p className="text-gray-400">No jobs found.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindWork;