const Job = require("../models/Job");
const Proposal = require("../models/Proposal");

// @route GET /api/jobs?search=&status=open
const getJobs = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (status) filter.status = status;

    const jobs = await Job.find(filter).populate("client", "name avatar").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("client", "name avatar bio");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/jobs  (client only, protected)
const createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, budgetType, budgetMin, budgetMax, hoursPerWeek } = req.body;

    const job = await Job.create({
      client: req.user._id,
      title,
      description,
      skillsRequired,
      budgetType,
      budgetMin,
      budgetMax,
      hoursPerWeek,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/jobs/:id/proposals  (freelancer applies to a job)
const submitProposal = async (req, res) => {
  try {
    const { coverLetter, proposedRate } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const proposal = await Proposal.create({
      job: job._id,
      freelancer: req.user._id,
      coverLetter,
      proposedRate,
    });

    res.status(201).json(proposal);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already applied to this job" });
    }
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/:id/proposals  (client views proposals on their job)
const getProposalsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view these proposals" });
    }

    const proposals = await Proposal.find({ job: job._id }).populate(
      "freelancer",
      "name avatar rating title skills"
    );
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  submitProposal,
  getProposalsForJob,
};
