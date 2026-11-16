const Job = require("../models/Job");
const Proposal = require("../models/Proposal");
const Conversation = require("../models/Conversation");

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
      return res.status(400).json({
        message: "Status must be accepted or rejected",
      });
    }

    const proposal = await Proposal.findById(req.params.id)
      .populate("job");

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found",
      });
    }

    // Verify that the logged-in user owns this job
    if (
      proposal.job.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this proposal",
      });
    }

    // Allow retrying an acceptance if conversation creation
    // previously failed or the request was interrupted.
    const alreadyAccepted =
      proposal.status === "accepted" && status === "accepted";

    if (proposal.status !== "pending" && !alreadyAccepted) {
      return res.status(400).json({
        message: "This proposal has already been processed",
      });
    }

    if (status === "accepted") {
      if (!alreadyAccepted) {
        if (proposal.job.status !== "open") {
          return res.status(400).json({
            message: "This job is no longer open",
          });
        }

        // Accept the proposal
        proposal.status = "accepted";
        await proposal.save();

        // Update job status
        proposal.job.status = "in_progress";
        await proposal.job.save();
      }

      // Create a conversation if one doesn't already exist
      await Conversation.findOneAndUpdate(
        { proposal: proposal._id },
        {
          $setOnInsert: {
            job: proposal.job._id,
            proposal: proposal._id,
            client: proposal.job.client,
            freelancer: proposal.freelancer,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );
    } else {
      proposal.status = "rejected";
      await proposal.save();
    }

    res.json(proposal);

  } catch (err) {
    console.error("Update proposal status error:", err);

    res.status(500).json({
      message: err.message,
    });
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