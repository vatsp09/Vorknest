const express = require("express");
const router = express.Router();
const {
  getMyProposals,
  getReceivedProposals,
  updateProposalStatus,
  withdrawProposal,
} = require("../controllers/proposalController");
const { protect } = require("../middleware/authMiddleware");

router.get("/mine", protect, getMyProposals);
router.get("/received", protect, getReceivedProposals);
router.put("/:id", protect, updateProposalStatus);
router.delete("/:id", protect, withdrawProposal);

module.exports = router;