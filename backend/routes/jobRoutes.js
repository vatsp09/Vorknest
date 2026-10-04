const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  submitProposal,
  getProposalsForJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.post("/:id/proposals", protect, submitProposal);
router.get("/:id/proposals", protect, getProposalsForJob);

module.exports = router;
