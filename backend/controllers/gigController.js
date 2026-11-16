const Gig = require("../models/Gig");
const Order = require("../models/Order");
const Conversation = require("../models/Conversation");

// GET /api/gigs?search=&category=&trending=true
const getGigs = async (req, res) => {
  try {
    const { search, category, trending } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (category && category !== "All Categories") filter.category = category;
    if (trending === "true") filter.isTrending = true;

    const gigs = await Gig.find(filter)
      .populate("freelancer", "name avatar rating")
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET /api/gigs/:id
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "freelancer",
      "name avatar rating reviewCount bio title skills email"
    );
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gigs  (freelancer only, protected)
const createGig = async (req, res) => {
  try {
    const { title, description, category, tags, image, startingPrice } = req.body;

    const gig = await Gig.create({
      freelancer: req.user._id,
      title,
      description,
      category,
      tags,
      image,
      startingPrice,
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  PUT /api/gigs/:id
const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this gig" });
    }

    Object.assign(gig, req.body);
    const updated = await gig.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/gigs/:id
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this gig" });
    }

    await gig.deleteOne();
    res.json({ message: "Gig removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const purchaseGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Prevent freelancers from purchasing their own gigs
    if (gig.freelancer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot purchase your own gig",
      });
    }

    // Simulate a successful purchase
    const order = await Order.create({
      gig: gig._id,
      client: req.user._id,
      freelancer: gig.freelancer,
      amount: gig.startingPrice,
      paymentStatus: "completed",
      orderStatus: "active",
    });

    // Automatically create a conversation
    const conversation = await Conversation.create({
      gig: gig._id,
      order: order._id,
      client: req.user._id,
      freelancer: gig.freelancer,
    });

    res.status(201).json({
      message: "Gig purchased successfully!",
      order,
      conversation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getGigs,
  getGigById,
  createGig,
  updateGig,
  deleteGig,
  purchaseGig,
};
