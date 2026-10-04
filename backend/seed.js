// Run with: node seed.js
// Populates 20 sample users (8 freelancer-only, 5 client-only, 7 dual-role),
// 15 gigs, and 12 jobs — all prices in INR (₹).
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Gig = require("./models/Gig");
const Job = require("./models/Job");

dotenv.config();

const PASSWORD = "password123";

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Gig.deleteMany(), Job.deleteMany()]);

  // ---------- 8 Freelancer-only users (hourlyRate in ₹/hr) ----------
  const freelancerOnly = await User.create([
    { name: "Rohan Mehta", email: "rohan.mehta@example.com", password: PASSWORD, mode: "freelancer", title: "Webflow Developer", hourlyRate: 3700, rating: 4.9, reviewCount: 132, skills: ["Webflow", "Landing Pages", "CMS"] },
    { name: "Ananya Sharma", email: "ananya.sharma@example.com", password: PASSWORD, mode: "freelancer", title: "React Developer", hourlyRate: 5000, rating: 5.0, reviewCount: 98, skills: ["React", "Redux", "Node.js"] },
    { name: "Karan Verma", email: "karan.verma@example.com", password: PASSWORD, mode: "freelancer", title: "UX Researcher", hourlyRate: 3300, rating: 4.8, reviewCount: 76, skills: ["UX", "Figma", "User Research"] },
    { name: "Priya Nair", email: "priya.nair@example.com", password: PASSWORD, mode: "freelancer", title: "Brand Designer", hourlyRate: 4600, rating: 4.9, reviewCount: 145, skills: ["Branding", "Logo Design", "Illustrator"] },
    { name: "Arjun Malhotra", email: "arjun.malhotra@example.com", password: PASSWORD, mode: "freelancer", title: "SEO Copywriter", hourlyRate: 2500, rating: 4.7, reviewCount: 61, skills: ["Copywriting", "SEO", "Content Strategy"] },
    { name: "Ishita Kapoor", email: "ishita.kapoor@example.com", password: PASSWORD, mode: "freelancer", title: "SEO Consultant", hourlyRate: 4150, rating: 4.8, reviewCount: 84, skills: ["SEO", "Google Ads", "Analytics"] },
    { name: "Siddharth Rao", email: "siddharth.rao@example.com", password: PASSWORD, mode: "freelancer", title: "Mobile App Developer", hourlyRate: 5400, rating: 4.9, reviewCount: 110, skills: ["Flutter", "React Native", "Firebase"] },
    { name: "Neha Gupta", email: "neha.gupta@example.com", password: PASSWORD, mode: "freelancer", title: "Video Editor", hourlyRate: 2900, rating: 4.7, reviewCount: 53, skills: ["Premiere Pro", "After Effects", "Motion Graphics"] },
  ]);

  // ---------- 5 Client-only users ----------
  const clientOnly = await User.create([
    { name: "TechNova Solutions", email: "hr@technova.example.com", password: PASSWORD, mode: "client", title: "Software Product Company", bio: "We build fintech and SaaS products for SMEs." },
    { name: "Bright Ideas Agency", email: "hello@brightideas.example.com", password: PASSWORD, mode: "client", title: "Digital Marketing Agency", bio: "Full-service creative and marketing agency." },
    { name: "Zenith Retail Pvt Ltd", email: "careers@zenithretail.example.com", password: PASSWORD, mode: "client", title: "E-commerce Retailer", bio: "D2C retail brand scaling across India." },
    { name: "GreenLeaf Organics", email: "team@greenleaf.example.com", password: PASSWORD, mode: "client", title: "Organic Foods Startup", bio: "Sustainable, organic grocery brand." },
    { name: "Skyline Consulting", email: "projects@skylineconsulting.example.com", password: PASSWORD, mode: "client", title: "Business Consulting Firm", bio: "Strategy and operations consulting for startups." },
  ]);

  // ---------- 7 Dual-role users (freelancer + client) ----------
  const dualRole = await User.create([
    { name: "Aarav Joshi", email: "aarav.joshi@example.com", password: PASSWORD, mode: "freelancer", title: "Full Stack Developer", hourlyRate: 5800, rating: 4.9, reviewCount: 102, skills: ["Node.js", "MongoDB", "AWS"], bio: "Also run a small dev agency and outsource design work." },
    { name: "Sanya Kapoor", email: "sanya.kapoor@example.com", password: PASSWORD, mode: "freelancer", title: "Product Designer", hourlyRate: 4600, rating: 4.8, reviewCount: 91, skills: ["Figma", "Prototyping", "Design Systems"] },
    { name: "Rahul Desai", email: "rahul.desai@example.com", password: PASSWORD, mode: "client", title: "Freelance Consultant & Startup Founder", bio: "Consult on the side, also hiring for my own startup." },
    { name: "Divya Menon", email: "divya.menon@example.com", password: PASSWORD, mode: "freelancer", title: "Content Strategist", hourlyRate: 3150, rating: 4.7, reviewCount: 67, skills: ["Content Writing", "Strategy", "Editing"] },
    { name: "Kabir Khanna", email: "kabir.khanna@example.com", password: PASSWORD, mode: "freelancer", title: "WordPress Developer", hourlyRate: 3500, rating: 4.8, reviewCount: 74, skills: ["WordPress", "PHP", "WooCommerce"] },
    { name: "Tanvi Reddy", email: "tanvi.reddy@example.com", password: PASSWORD, mode: "client", title: "Marketing Freelancer & Agency Owner", bio: "Freelance marketer who also outsources overflow work." },
    { name: "Yash Trivedi", email: "yash.trivedi@example.com", password: PASSWORD, mode: "freelancer", title: "Data Analyst", hourlyRate: 4000, rating: 4.9, reviewCount: 58, skills: ["Python", "SQL", "Power BI"] },
  ]);

  const [rohan, ananya, karan, priya, arjun, ishita, siddharth, neha] = freelancerOnly;
  const [technova, brightIdeas, zenith, greenleaf, skyline] = clientOnly;
  const [aarav, sanya, rahul, divya, kabir, tanvi, yash] = dualRole;

  // ---------- Gigs (startingPrice in ₹, ~83x the earlier $ prices) ----------
  await Gig.create([
    { freelancer: rohan._id, title: "I will design a high-converting Webflow landing page", description: "Custom Webflow design focused on conversions.", category: "Webflow", tags: ["Webflow", "Landing Page"], image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600", startingPrice: 70500, rating: 4.9, reviewCount: 120, isTrending: true },
    { freelancer: ananya._id, title: "I will build a custom React dashboard with advanced analytics", description: "Full-featured admin dashboard built in React.", category: "React", tags: ["React", "Dashboard"], image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600", startingPrice: 99600, rating: 5.0, reviewCount: 88, isTrending: true },
    { freelancer: karan._id, title: "I will conduct a comprehensive UX audit for your product", description: "In-depth UX audit with actionable recommendations.", category: "UX Design", tags: ["UX", "Audit"], image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", startingPrice: 41500, rating: 4.8, reviewCount: 64, isTrending: true },
    { freelancer: priya._id, title: "I will create a bespoke brand identity package", description: "Full branding package: logo, colors, typography, guidelines.", category: "Branding", tags: ["Branding", "Logo"], image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600", startingPrice: 124500, rating: 5.0, reviewCount: 150, isTrending: true },
    { freelancer: arjun._id, title: "I will write SEO-optimized website copy that converts", description: "Persuasive, search-friendly copy for landing pages and blogs.", category: "Copywriting", tags: ["Copywriting", "SEO"], image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600", startingPrice: 24900, rating: 4.7, reviewCount: 61 },
    { freelancer: ishita._id, title: "I will run a full technical SEO audit for your website", description: "Site speed, indexing, and on-page SEO fixes.", category: "SEO", tags: ["SEO", "Technical Audit"], image: "https://images.unsplash.com/photo-1571677246347-5040036b95cc?w=600", startingPrice: 53950, rating: 4.8, reviewCount: 84 },
    { freelancer: siddharth._id, title: "I will build a cross-platform mobile app with Flutter", description: "iOS + Android app from a single codebase.", category: "Mobile Development", tags: ["Flutter", "Mobile App"], image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600", startingPrice: 166000, rating: 4.9, reviewCount: 110, isTrending: true },
    { freelancer: neha._id, title: "I will edit a professional promo video with motion graphics", description: "Polished promo/ad video with animated text and transitions.", category: "Video Editing", tags: ["Video Editing", "Motion Graphics"], image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600", startingPrice: 33200, rating: 4.7, reviewCount: 53 },
    { freelancer: aarav._id, title: "I will develop a full stack MERN web application", description: "End-to-end MERN app with auth, API, and deployment.", category: "Full Stack Development", tags: ["MERN", "Node.js"], image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600", startingPrice: 149400, rating: 4.9, reviewCount: 102, isTrending: true },
    { freelancer: sanya._id, title: "I will design a complete product design system in Figma", description: "Reusable component library and design tokens.", category: "Product Design", tags: ["Figma", "Design System"], image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600", startingPrice: 74700, rating: 4.8, reviewCount: 91 },
    { freelancer: divya._id, title: "I will write engaging blog content for your brand", description: "SEO-friendly blog articles tailored to your audience.", category: "Content Writing", tags: ["Content Writing", "Blogging"], image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600", startingPrice: 20750, rating: 4.7, reviewCount: 67 },
    { freelancer: kabir._id, title: "I will build a custom WordPress website with WooCommerce", description: "Fully responsive WordPress site with e-commerce setup.", category: "WordPress", tags: ["WordPress", "WooCommerce"], image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600", startingPrice: 58100, rating: 4.8, reviewCount: 74 },
    { freelancer: yash._id, title: "I will build interactive dashboards in Power BI", description: "Business intelligence dashboards from raw data.", category: "Data Science", tags: ["Power BI", "Data Visualization"], image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", startingPrice: 45650, rating: 4.9, reviewCount: 58 },
    { freelancer: rahul._id, title: "I will consult on your startup's go-to-market strategy", description: "1:1 strategy sessions for early-stage founders.", category: "Consulting", tags: ["Strategy", "GTM"], image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600", startingPrice: 83000, rating: 4.8, reviewCount: 40 },
    { freelancer: tanvi._id, title: "I will run a full-funnel digital marketing campaign", description: "Ads, email, and social strategy for growth.", category: "Digital Marketing", tags: ["Digital Marketing", "Ads"], image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600", startingPrice: 66400, rating: 4.7, reviewCount: 49 },
  ]);

  // ---------- Jobs (budgets in ₹) ----------
  await Job.create([
    { client: technova._id, title: "Senior Full Stack Engineer for FinTech Startup", description: "Looking for an experienced full stack engineer for a growing fintech product.", skillsRequired: ["Node.js", "React"], budgetType: "fixed", budgetMin: 415000, budgetMax: 830000, paymentVerified: true },
    { client: brightIdeas._id, title: "Brand Identity & Website Design for Boutique Agency", description: "Need a designer to create a full brand identity and website.", skillsRequired: ["Figma", "Branding"], budgetType: "hourly", budgetMin: 3700, budgetMax: 6600, hoursPerWeek: "20-30 hrs/week", paymentVerified: false },
    { client: technova._id, title: "Technical Writer for Developer Documentation API", description: "Write clear, developer-facing documentation for our public API.", skillsRequired: ["Technical Writing", "API Docs"], budgetType: "fixed", budgetMin: 124500, budgetMax: 124500, paymentVerified: true },
    { client: zenith._id, title: "Shopify Store Setup & Product Migration", description: "Migrate our catalog to Shopify and customize the theme.", skillsRequired: ["Shopify", "Liquid"], budgetType: "fixed", budgetMin: 74700, budgetMax: 149400, paymentVerified: true },
    { client: greenleaf._id, title: "Social Media Manager for Organic Food Brand", description: "Manage Instagram and Facebook content calendar and ads.", skillsRequired: ["Social Media", "Content Calendar"], budgetType: "hourly", budgetMin: 1650, budgetMax: 2900, hoursPerWeek: "10-15 hrs/week", paymentVerified: false },
    { client: skyline._id, title: "Business Analyst for Market Research Report", description: "Compile a market research report for a client pitch.", skillsRequired: ["Market Research", "Excel"], budgetType: "fixed", budgetMin: 99600, budgetMax: 99600, paymentVerified: true },
    { client: zenith._id, title: "Performance Marketing Specialist for D2C Brand", description: "Run and optimize paid ad campaigns across Meta and Google.", skillsRequired: ["Meta Ads", "Google Ads"], budgetType: "hourly", budgetMin: 2500, budgetMax: 4550, hoursPerWeek: "15-20 hrs/week", paymentVerified: true },
    { client: aarav._id, title: "UI Designer Needed for SaaS Dashboard Revamp", description: "Redesign our internal dashboard's UI for better usability.", skillsRequired: ["Figma", "UI Design"], budgetType: "fixed", budgetMin: 132800, budgetMax: 132800, paymentVerified: true },
    { client: sanya._id, title: "Illustrator for Children's App Characters", description: "Design 6-8 playful character illustrations for a kids' learning app.", skillsRequired: ["Illustration", "Character Design"], budgetType: "fixed", budgetMin: 58100, budgetMax: 58100, paymentVerified: false },
    { client: rahul._id, title: "Financial Model Builder for Seed Pitch Deck", description: "Build a 3-year financial model for an investor pitch.", skillsRequired: ["Excel", "Financial Modeling"], budgetType: "fixed", budgetMin: 66400, budgetMax: 66400, paymentVerified: true },
    { client: divya._id, title: "Proofreader for Upcoming Ebook Launch", description: "Proofread and copyedit a 150-page non-fiction ebook.", skillsRequired: ["Proofreading", "Editing"], budgetType: "fixed", budgetMin: 29050, budgetMax: 29050, paymentVerified: false },
    { client: kabir._id, title: "React Native Developer for Freelance Marketplace App", description: "Build core screens for a two-sided marketplace app.", skillsRequired: ["React Native", "Firebase"], budgetType: "hourly", budgetMin: 3300, budgetMax: 5400, hoursPerWeek: "25-30 hrs/week", paymentVerified: true },
  ]);

  console.log("Seed data created: 20 users (8 freelancer-only, 5 client-only, 7 dual-role), 15 gigs, 12 jobs — all in ₹.");
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});