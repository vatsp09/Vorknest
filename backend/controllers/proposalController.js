const Job = require("../models/Job");
const Proposal = require("../models/Proposal");

// @route GET /api/proposals/mine  (freelancer: proposals I have sent)
const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate({
        path: "job",
        select: "title budgetType budgetMin budgetMax status client",
        populate: { path: "client", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/proposals/received  (client: proposals on jobs I posted)
const getReceivedProposals = async (req, res) => {
  try {
    const myJobs = await Job.find({ client: req.user._id }).select("_id");
    const jobIds = myJobs.map((j) => j._id);

    const proposals = await Proposal.find({ job: { $in: jobIds } })
      .populate("freelancer", "name avatar rating reviewCount title skills email")
      .populate("job", "title budgetType budgetMin budgetMax status")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/proposals/:id  (client accepts or rejects)
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const proposal = await Proposal.findById(req.params.id).populate("job");
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (proposal.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this proposal" });
    }

    proposal.status = status;
    await proposal.save();

    // Accepting a proposal moves the job out of the open list
    if (status === "accepted") {
      proposal.job.status = "in_progress";
      await proposal.job.save();
    }

    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this proposal" });
    }
    if (proposal.status !== "pending") {
      return res.status(400).json({ message: "Only pending proposals can be withdrawn" });
    }

    await proposal.deleteOne();
    res.json({ message: "Proposal withdrawn" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyProposals, getReceivedProposals, updateProposalStatus, withdrawProposal };