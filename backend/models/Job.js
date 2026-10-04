const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true }, // "Senior Full Stack Engineer for FinTech Startup"
    description: { type: String, required: true },
    skillsRequired: [{ type: String }], // ["Node.js", "React"]
    budgetType: { type: String, enum: ["fixed", "hourly"], required: true },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    hoursPerWeek: { type: String, default: "" }, // "20-30 hrs/week"
    paymentVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["open", "in_progress", "closed"], default: "open" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", skillsRequired: "text" });

module.exports = mongoose.model("Job", jobSchema);
