import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaGlobe, FaUsers } from "react-icons/fa";
import Toast from "./Toast";
import "react-tooltip/dist/react-tooltip.css";

// Component for displaying country information in a card format
const CountryCard = ({ country }) => {
  // Get favorites and auth context hooks
  const { toggleFavorite, isFavorite } = useFavorites();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  if (!country) return null;

  // Check if country is in favorites
  const fav = isFavorite(country.cca3);

  // Handle favorite button click
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    toggleFavorite(country);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {showLoginPrompt && (
        <Toast
          message="Please login to save favorites"
          type="error"
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
      <Link
        to={`/country/${country.cca3}`}
        className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 block overflow-hidden"
      >
        {/* Favorite Button with Popup */}
        <div className="relative">
          <motion.button
            onClick={handleFavoriteClick}
            onMouseEnter={() => !currentUser && setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
            className={`absolute top-3 right-3 z-10 bg-white border border-gray-200 p-2 rounded-full shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 group/heart`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            data-tooltip-id="fav-tooltip"
            data-tooltip-content={fav ? "Remove from favorites" : (currentUser ? "Add to favorites" : "Login to save favorites")}
          >
            {fav ? (
              <FaHeart className="text-red-500 transition-colors duration-300 text-2xl drop-shadow-sm" />
            ) : (
              <FaRegHeart className="text-gray-400 group-hover/heart:text-red-400 transition-colors duration-300 text-2xl drop-shadow-sm" />
            )}
          </motion.button>
          
          {/* Tooltip for heart button */}
          {/* Custom Popup */}
          {showPopup && !currentUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-12 right-3 bg-white px-5 py-3 rounded-lg shadow-xl z-40 whitespace-nowrap border border-blue-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A4.001 4.001 0 0016 15V9a4 4 0 10-8 0v6a4.001 4.001 0 002.125 3.825M12 15v2m0 0h.01M12 17a1 1 0 100-2 1 1 0 000 2z" /></svg>
              <span className="font-semibold text-blue-700 text-sm">You must log in to save favorites.</span>
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-blue-200 transform rotate-45 z-30"></div>
            </motion.div>
          )}
        </div>

        {/* Country Flag */}
        <div className="relative h-36 sm:h-48 overflow-hidden">
          <img
            src={country.flags?.png}
            alt={`${country.name?.common} Flag`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Country Info */}
        <div className="p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {country.name?.common}
          </h2>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
              <FaMapMarkerAlt className="text-blue-500" />
              <span><span className="font-medium">Capital:</span> {country.capital?.[0] || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
              <FaGlobe className="text-green-500" />
              <span><span className="font-medium">Region:</span> {country.region || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
              <FaUsers className="text-purple-500" />
              <span><span className="font-medium">Population:</span> {country.population?.toLocaleString() || "N/A"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CountryCard;
