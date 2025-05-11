import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaClock } from "react-icons/fa";

// Simple mapping for demo; for production, use a more complete mapping or a timezone API
const countryToTimezone = {
  "United States": "America/New_York",
  "India": "Asia/Kolkata",
  "United Kingdom": "Europe/London",
  "Japan": "Asia/Tokyo",
  "Australia": "Australia/Sydney",
  "Germany": "Europe/Berlin",
  "France": "Europe/Paris",
  "Brazil": "America/Sao_Paulo",
  "Canada": "America/Toronto",
  "China": "Asia/Shanghai",
  // ... add more as needed
};

function getTimeWithOffset(offsetString) {
  // offsetString example: "UTC+05:30" or "UTC-04:00"
  const match = offsetString.match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!match) return null;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const now = new Date();
  // Get UTC time in ms
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  // Calculate offset in ms
  const offsetMs = sign * (hours * 60 + minutes) * 60000;
  // Create new date with offset
  const local = new Date(utc + offsetMs);
  return local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

const LiveTimer = () => {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [offsetString, setOffsetString] = useState("");
  const [flagUrl, setFlagUrl] = useState("");

  useEffect(() => {
    let timer;
    if (timezone) {
      // Use IANA timezone
      const updateTime = () => {
        const now = new Date();
        const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: timezone };
        setTime(now.toLocaleTimeString([], options));
      };
      updateTime();
      timer = setInterval(updateTime, 1000);
    } else if (offsetString) {
      // Use UTC offset
      const updateTime = () => {
        setTime(getTimeWithOffset(offsetString));
      };
      updateTime();
      timer = setInterval(updateTime, 1000);
    }
    return () => clearInterval(timer);
  }, [timezone, offsetString]);

  // Debounced country suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    const handler = setTimeout(async () => {
      try {
        const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(search.trim())}`);
        setSuggestions(res.data.map(c => c.name.common));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    handleSearchCountry(name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    handleSearchCountry(search.trim());
  };

  const handleSearchCountry = async (countryName) => {
    setError("");
    setTime("");
    setTimezone("");
    setCountry("");
    setOffsetString("");
    setFlagUrl("");
    const tz = countryToTimezone[countryName];
    if (tz) {
      setCountry(countryName);
      setTimezone(tz);
      setOffsetString("");
      setFlagUrl("");
      return;
    }
    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
      const countryData = res.data[0];
      if (countryData && countryData.timezones && countryData.timezones.length > 0) {
        setCountry(countryData.name.common);
        setTimezone("");
        setOffsetString(countryData.timezones[0]);
        setError("");
        setFlagUrl(countryData.flags?.svg || countryData.flags?.png || "");
      } else {
        setError("Timezone not found for this country.");
      }
    } catch (err) {
      setError("Country not found.");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-20 w-full max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.01, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
          className="rounded-2xl shadow-2xl bg-white border border-blue-100 px-8 py-10 sm:px-12 sm:py-12 flex flex-col items-center"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="text-[#1877f2] text-3xl drop-shadow" />
              <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1877f2] tracking-tight">
                Live Country Timer
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base text-center max-w-xs">Check the current time in any country, live and accurate.</p>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 w-full max-w-md relative">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Enter country name..."
                className="flex-1 w-full px-5 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-[#1877f2] outline-none shadow bg-white text-lg font-medium placeholder-gray-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search && setShowSuggestions(true)}
                autoComplete="off"
              />
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 bg-white border border-blue-100 rounded-xl shadow-lg mt-2 z-10 max-h-56 overflow-auto"
                  >
                    {suggestions.map((s, i) => (
                      <motion.li
                        key={s}
                        className="px-5 py-2 hover:bg-blue-50 cursor-pointer text-base text-gray-700"
                        onClick={() => handleSuggestionClick(s)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        {s}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {loadingSuggestions && (
                <div className="absolute right-3 top-3 text-xs text-gray-400">Loading...</div>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.07, backgroundColor: "#165ec9" }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-xl bg-[#1877f2] text-white font-semibold shadow text-lg transition-all focus:ring-2 focus:ring-blue-300 focus:outline-none hover:bg-[#165ec9]"
            >
              Show Time
            </motion.button>
          </form>
          <AnimatePresence>
            {country && (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="text-center mt-6"
              >
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`${country} flag`}
                    className="mx-auto mb-4 w-20 h-12 object-contain rounded-lg shadow border-2 border-blue-100"
                  />
                )}
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  {country}
                </h2>
                <motion.div
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl font-mono bg-white rounded-2xl inline-block px-10 py-6 shadow border-2 border-blue-200 text-gray-800 tracking-widest mb-2 ring-2 ring-blue-50"
                  style={{ boxShadow: "0 0 24px 0 rgba(24,119,242,0.08)" }}
                >
                  {time}
                </motion.div>
                <div className="mt-2 text-sm text-blue-500 font-medium">
                  {timezone ? `Timezone: ${timezone}` : offsetString ? `Timezone: ${offsetString}` : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 mt-4 font-semibold animate-pulse">{error}</motion.div>}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LiveTimer; 