import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(null); // { type: "success" | "error", text: string }

  useEffect(() => {
    const loadGig = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/gigs/${id}`);
        setGig(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this gig.");
      } finally {
        setLoading(false);
      }
    };
    loadGig();
  }, [id]);

  // Auto-dismiss the flash message after 4 seconds
  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(timer);
  }, [flash]);

  const handleHire = () => {
    // 1. Not logged in -> go to login, and come back here afterwards
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // 2. Logged in but in freelancer mode -> stay here, show message
    if (user.mode !== "client") {
      setFlash({
        type: "error",
        text: "Sorry, you need to be in Client mode to hire. Switch to Client mode first.",
      });
      return;
    }

    // 3. Can't hire yourself (for dual-role users)
    if (gig?.freelancer?._id === user._id) {
      setFlash({ type: "error", text: "You can't hire yourself on your own gig." });
      return;
    }

    // 4. Client -> order generated
    setFlash({
      type: "success",
      text: "Order generated successfully! The freelancer will be notified.",
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this gig permanently?")) return;
    try {
      await api.delete(`/gigs/${id}`);
      navigate("/profile");
    } catch (err) {
      setFlash({ type: "error", text: err.response?.data?.message || "Could not delete gig." });
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-400">Loading gig...</div>;
  }

  if (error || !gig) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">{error || "Gig not found."}</p>
        <Link to="/find-work" className="text-brand-600 font-semibold mt-3 inline-block">
          Back to Find Work
        </Link>
      </div>
    );
  }

  const freelancer = gig.freelancer || {};
  const isOwner = user && freelancer._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Flash message */}
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

      <Link to="/find-work" className="flex items-center gap-2 text-gray-500 hover:text-brand-600 text-sm mb-6">
        <ArrowLeft size={16} /> Back to all gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: gig content */}
        <div className="lg:col-span-2">
          <img src={gig.image} alt={gig.title} className="w-full h-80 object-cover rounded-2xl" />

          <div className="flex items-center gap-2 mt-5">
            <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
              {gig.category}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <Star size={15} className="fill-yellow-400 text-yellow-400" />
              {gig.rating?.toFixed(1) || "New"}{" "}
              <span className="text-gray-400 font-normal">({gig.reviewCount || 0} reviews)</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mt-3">{gig.title}</h1>

          <p className="text-gray-600 leading-relaxed mt-5">{gig.description}</p>

          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
              <Tag size={18} className="text-brand-600" /> Tech Stack &amp; Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {(gig.tags || []).length > 0 ? (
                gig.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No specific tags listed.</span>
              )}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Briefcase size={18} className="text-brand-600" /> About the Freelancer
            </h2>
            <div className="flex items-start gap-4">
              <img
                src={freelancer.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${freelancer.name}`}
                alt={freelancer.name}
                className="w-16 h-16 rounded-xl object-cover bg-brand-50"
              />
              <div>
                <p className="font-bold text-gray-900">{freelancer.name}</p>
                <p className="text-brand-600 text-sm font-medium">{freelancer.title || "Freelancer"}</p>
                <p className="text-gray-600 text-sm mt-2 max-w-xl">
                  {freelancer.bio || "This freelancer hasn't added a bio yet."}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(freelancer.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-brand-100 text-brand-700 font-medium px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: sticky price + hire card */}
        <aside className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 tracking-wide font-semibold">STARTING AT</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              ₹{gig.startingPrice?.toLocaleString("en-IN")}
            </p>

            <div className="flex items-center gap-2 mt-4 text-sm text-emerald-600 font-medium">
              <ShieldCheck size={16} /> Verified Freelancer Profile
            </div>

            {isOwner ? (
              <>
                <p className="text-sm text-gray-500 mt-6 bg-gray-50 rounded-xl p-3 text-center">
                  This is your gig.
                </p>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3.5 rounded-xl mt-3"
                >
                  <Trash2 size={17} /> Delete This Gig
                </button>
              </>
            ) : (
              <button
                onClick={handleHire}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl mt-6"
              >
                <ShoppingBag size={17} /> Hire This Freelancer
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Freelancer Credibility</p>
            <div className="flex items-center gap-2">
              <Star size={20} className="fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">
                {freelancer.rating?.toFixed(1) || "New"}
              </span>
              <span className="text-gray-400 text-sm">/ 5.0</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on {freelancer.reviewCount || 0} client reviews
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GigDetail;