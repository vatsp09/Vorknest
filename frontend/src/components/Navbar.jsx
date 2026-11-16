import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, Sparkles, Repeat, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLink =
  "text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors";
const activeNavLink = "text-sm font-medium text-brand-600";

const Navbar = () => {
  const { user, switchMode, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isClient = user?.mode === "client";

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  // Freelancer -> Client goes through the Client Profile form.
  // Client -> Freelancer switches straight away.
  const handleSwitchRole = () => {
    setMenuOpen(false);
    if (isClient) {
      switchMode();
    } else {
      navigate("/become-client");
    }
  };

  return (
    <header className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-1.5">
          <Sparkles className="text-brand-600" size={20} />
          <span className="text-xl font-bold text-brand-700">Vorknest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/find-work" className={({ isActive }) => (isActive ? activeNavLink : navLink)}>
            Find Work
          </NavLink>

          {isClient ? (
            <NavLink to="/hire" className={({ isActive }) => (isActive ? activeNavLink : navLink)}>
              Hire Talent
            </NavLink>
          ) : (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? activeNavLink : navLink)}>
              My Jobs
            </NavLink>
          )}

          <NavLink to="/messages" className={({ isActive }) => (isActive ? activeNavLink : navLink)}>
            Messages
          </NavLink>

          {user && (
            <button
              onClick={handleSwitchRole}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100"
            >
              <Repeat size={14} />
              {isClient ? "Become a Freelancer" : "Become a Client"}
            </button>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <Search size={19} className="text-gray-500 cursor-pointer" />
        <Bell size={19} className="text-gray-500 cursor-pointer" />

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="text-left leading-tight">
                <span className="block text-sm font-semibold text-gray-800">{user.name}</span>
                <span className="block text-xs text-gray-400 capitalize">{user.mode} Mode</span>
              </span>
              <ChevronDown size={15} className="text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} /> View Profile
                </Link>

                <button
                  onClick={handleSwitchRole}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Repeat size={16} />
                  Switch to {isClient ? "Freelancer" : "Client"} Mode
                </button>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={16} /> Account Settings
                </Link>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600">
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;