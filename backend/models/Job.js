const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    budgetType: { type: String, enum: ["fixed", "hourly"], required: true },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    hoursPerWeek: { type: String, default: "" },
    experienceLevel: { type: String, enum: ["entry", "intermediate", "expert"], default: "intermediate" },
    timeline: { type: String, default: "" },
    paymentVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["open", "in_progress", "closed"], default: "open" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", skillsRequired: "text" });

module.exports = mongoose.model("Job", jobSchema);