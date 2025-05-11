import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { FaHeart, FaUser, FaSignOutAlt, FaGlobe } from "react-icons/fa";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
};
const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.08 } }),
  hover: { scale: 1.08, color: "#7c3aed" },
};

// Main layout component with header, main content, and footer
const Layout = ({ children }) => {
  // Get favorites and auth context hooks
  const { favorites } = useFavorites();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/favorites", label: "Favorites", showBadge: true },
    { to: "/live-timer", label: "Live Timer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            {/* Brand */}
            <Link
              to="/"
              className="group flex items-center space-x-2 mb-2 sm:mb-0"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-[#1877f2] rounded-lg flex items-center justify-center"
              >
                <FaGlobe className="text-white text-lg" />
              </motion.div>
              <span className="text-lg sm:text-2xl font-bold text-[#1877f2] group-hover:text-blue-800 transition-all duration-300">
                Country Explorer
              </span>
            </Link>

            {/* Responsive Nav */}
            <nav className="w-full sm:w-auto">
              <button
                className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <AnimatePresence>
                {navOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="sm:hidden bg-white rounded-lg shadow p-4 absolute left-0 right-0 z-40 mt-2"
                  >
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.to}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={linkVariants}
                        className="inline-block relative"
                      >
                        <Link
                          to={link.to}
                          className={`block px-4 py-2 text-gray-700 font-medium transition-colors duration-200 ${location.pathname === link.to ? "text-[#1877f2] font-bold border-b-2 border-[#1877f2]" : "hover:text-[#1877f2]"}`}
                          onClick={() => setNavOpen(false)}
                        >
                          {link.label}
                          {link.showBadge && favorites.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow border border-white">
                              {favorites.length}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              <ul className="hidden sm:flex sm:items-center sm:gap-4 mt-2 sm:mt-0 bg-transparent p-0 static">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={linkVariants}
                    className="inline-block relative"
                  >
                    <Link
                      to={link.to}
                      className={`block px-4 py-2 text-gray-700 font-medium transition-colors duration-200 ${location.pathname === link.to ? "text-[#1877f2] font-bold border-b-2 border-[#1877f2]" : "hover:text-[#1877f2]"}`}
                    >
                      {link.label}
                      {link.showBadge && favorites.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow border border-white">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
              {/* Auth Buttons */}
              {currentUser ? (
                <motion.button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 bg-[#1877f2] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-[#1877f2] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FaUser />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Country Explorer</p>
            <p className="mt-1">Created by Lasiru Minruk</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
