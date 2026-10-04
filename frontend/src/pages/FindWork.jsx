import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import GigCard from "../components/GigCard";
import LatestJobs from "../components/LatestJobs";

const FindWork = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [tab, setTab] = useState(searchParams.get("tab") === "jobs" ? "jobs" : "gigs");
  const [gigs, setGigs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [gigsRes, jobsRes] = await Promise.all([
        api.get(`/gigs${search ? `?search=${search}` : ""}`),
        api.get(`/jobs${search ? `?search=${search}` : ""}`),
      ]);
      setGigs(gigsRes.data);
      setJobs(jobsRes.data);
    };
    load();
  }, [search]);

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
          Job Posts
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
        <div className="mt-8 max-w-2xl">
          <LatestJobs jobs={jobs} />
        </div>
      )}
    </div>
  );
};

export default FindWork;
