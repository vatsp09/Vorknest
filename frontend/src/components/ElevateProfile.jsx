import { Play, Video } from "lucide-react";

const ElevateProfile = () => {
  return (
    <section className="bg-ink rounded-3xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-lg">
        <h2 className="text-white text-3xl font-bold">Elevate Your Profile</h2>
        <p className="text-gray-300 mt-3 leading-relaxed">
          Stand out to premium clients by adding a video introduction to your portfolio.
          Profiles with video see a 40% increase in invites.
        </p>
        <button className="mt-6 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-xl">
          Add Video <Video size={18} />
        </button>
      </div>
      <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Play className="text-emerald-400 fill-emerald-400" size={22} />
        </div>
      </div>
    </section>
  );
};

export default ElevateProfile;
