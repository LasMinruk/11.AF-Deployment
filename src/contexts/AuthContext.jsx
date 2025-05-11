import { createContext, useContext, useState, useEffect } from "react";

// Create authentication context
const AuthContext = createContext();

// Provider component for managing user authentication
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  // Login function to set user and store in localStorage
  const login = (email) => {
    const user = { email };
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Logout function to clear user and localStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
