import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TrendingServices from "../components/TrendingServices";
import LatestJobs from "../components/LatestJobs";
import ElevateProfile from "../components/ElevateProfile";
import api from "../api/axios";

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [gigsRes, jobsRes] = await Promise.all([
          api.get("/gigs?trending=true"),
          api.get("/jobs?status=open"),
        ]);
        setGigs(gigsRes.data.slice(0, 4));
        setJobs(jobsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load homepage data", err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <TrendingServices gigs={gigs} />
        </div>
        <LatestJobs jobs={jobs} />
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <ElevateProfile />
      </div>
    </div>
  );
};

export default Home;
