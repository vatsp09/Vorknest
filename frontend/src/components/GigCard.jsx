import { Star } from "lucide-react";

const GigCard = ({ gig }) => {
  const freelancerName = gig.freelancer?.name || "Freelancer";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img src={gig.image} alt={gig.title} className="w-full h-44 object-cover" />
        <span className="absolute top-3 right-3 bg-white/95 text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          {gig.rating?.toFixed(1) || "New"}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={gig.freelancer?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${freelancerName}`}
            className="w-6 h-6 rounded-full"
            alt={freelancerName}
          />
          <span className="text-sm font-medium text-gray-600">{freelancerName}</span>
        </div>
        <p className="text-gray-800 font-medium leading-snug line-clamp-2">{gig.title}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400 tracking-wide font-semibold">STARTING AT</span>
          <span className="text-lg font-bold text-gray-900">
            ₹{gig.startingPrice?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GigCard;