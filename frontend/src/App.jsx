import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FindWork from "./pages/FindWork";
import PostJob from "./pages/PostJob";
import PostGig from "./pages/PostGig";
import Profile from "./pages/Profile";
import GigDetail from "./pages/GigDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import BecomeClient from "./pages/BecomeClient";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-work" element={<FindWork />} />
        <Route path="/hire" element={<PostJob />} />
        <Route path="/post-gig" element={<PostGig />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gigs/:id" element={<GigDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/become-client" element={<BecomeClient />} />
      </Routes>
    </div>
  );
}

export default App;