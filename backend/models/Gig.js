const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true }, // "I will design a high-converting Webflow site"
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g. Webflow, React, Branding
    tags: [{ type: String }],
    image: { type: String, default: "" },
    startingPrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

gigSchema.index({ title: "text", tags: "text", category: "text" });

module.exports = mongoose.model("Gig", gigSchema);
