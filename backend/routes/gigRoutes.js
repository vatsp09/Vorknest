const express = require("express");
const router = express.Router();
const { getGigs, getGigById, createGig, updateGig, deleteGig } = require("../controllers/gigController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getGigs);
router.get("/:id", getGigById);
router.post("/", protect, createGig);
router.put("/:id", protect, updateGig);
router.delete("/:id", protect, deleteGig);

module.exports = router;
