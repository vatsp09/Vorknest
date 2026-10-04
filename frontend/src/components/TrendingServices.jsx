import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import GigCard from "./GigCard";

const TrendingServices = ({ gigs }) => {
  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Trending Services</h2>
          <p className="text-gray-500 mt-1">Get inspired by what top freelancers are offering.</p>
        </div>
        <Link to="/find-work" className="text-brand-600 font-semibold flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
    </section>
  );
};

export default TrendingServices;
