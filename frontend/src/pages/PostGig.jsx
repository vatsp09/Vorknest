import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Tag, Image as ImageIcon, X, ArrowRight } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Webflow", "React", "UX Design", "Branding", "Copywriting", "SEO"];

const PostGig = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addTag = (tag) => {
    const clean = tag.trim();
    if (!clean || tags.includes(clean) || tags.length >= 5) return;
    setTags([...tags, clean]);
    setTagInput("");
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handlePublish = async () => {
    if (!user) return setError("Please log in to publish a gig.");
    if (!title || !description || !startingPrice) {
      return setError("Please fill in title, description, and starting price.");
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/gigs", {
        title,
        description,
        category,
        tags,
        image: image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
        startingPrice: Number(startingPrice),
      });
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold tracking-wide px-3 py-1 rounded-full">
        NEW GIG
      </span>
      <h1 className="text-5xl font-extrabold text-gray-900 mt-3">Create a Gig</h1>
      <p className="text-gray-500 text-lg mt-3 max-w-xl">
        Showcase a service you offer. Give it a clear "I will..." title so clients know exactly
        what they're getting.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <Sparkles size={20} className="text-brand-600" /> Gig Details
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gig Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="I will design a high-converting Webflow landing page"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 mb-6"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exactly what's included, your process, and turnaround time..."
              rows={6}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 mb-6"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <Tag size={20} className="text-brand-600" /> Tags
            </h2>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter (e.g. Landing Page, Figma)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 bg-brand-100 text-brand-700 font-medium px-3 py-1.5 rounded-full"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              {tags.length === 0 && <span className="text-gray-400 text-sm">No tags yet.</span>}
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <ImageIcon size={20} className="text-brand-600" /> Cover Image &amp; Price
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 mb-6"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price (INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="40000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-brand-500"
              />
            </div>
          </section>
        </div>

        {/* Right: sticky preview */}
        <aside className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <img
              src={image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"}
              alt="Preview"
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || "you"}`}
                  className="w-6 h-6 rounded-full"
                  alt=""
                />
                <span className="text-sm font-medium text-gray-600">{user?.name || "You"}</span>
              </div>
              <p className="text-gray-800 font-medium leading-snug line-clamp-2">
                {title || "Your gig title will appear here"}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400 tracking-wide font-semibold">STARTING AT</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{Number(startingPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            onClick={handlePublish}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl mt-4"
          >
            {submitting ? "Publishing..." : "Publish Gig"} <ArrowRight size={18} />
          </button>
        </aside>
      </div>
    </div>
  );
};

export default PostGig;