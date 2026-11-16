const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, mode: mode || "freelancer" });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mode: user.mode,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mode: user.mode,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// PUT /api/auth/mode  (toggle Client Mode / Freelancer Mode)
const switchMode = async (req, res) => {
  try {
    req.user.mode = req.user.mode === "client" ? "freelancer" : "client";
    await req.user.save();
    res.json({ mode: req.user.mode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile  (freelancer edits their own profile)
const updateProfile = async (req, res) => {
  try {
    const { title, bio, skills, hourlyRate, avatar } = req.body;

    if (title !== undefined) req.user.title = title;
    if (bio !== undefined) req.user.bio = bio;
    if (skills !== undefined) req.user.skills = skills;
    if (hourlyRate !== undefined) req.user.hourlyRate = hourlyRate;
    if (avatar !== undefined) req.user.avatar = avatar;

    const updated = await req.user.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getMe, switchMode, updateProfile };


