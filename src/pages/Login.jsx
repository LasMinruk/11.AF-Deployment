import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

// Login component for user authentication
const Login = () => {
  // State management for form and UI
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submission and email validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setToast({ show: true, type: 'error', message: 'Login failed: Invalid email address.' });
      return;
    }
    setError("");
    login(email);
    setToast({ show: true, type: 'success', message: 'Login successful! Redirecting...' });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
      navigate("/");
    }, 2500);
  };

  // Render login form with responsive design
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
          duration={2500}
        />
      )}
      <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl rounded-3xl p-8 sm:p-10 transition-all duration-300">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-[#1877f2] hover:text-blue-800 text-sm font-medium transition duration-200"
        >
          ← Go Back
        </button>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#1877f2] tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-600 mt-1">Log in to explore countries you love</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-[#1877f2]"} transition duration-200 shadow-inner`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#1877f2] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 hover:shadow-xl transition duration-200"
          >
            Login
          </button>
        </form>
        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Country Explorer by <span className="text-[#1877f2] font-medium">Lasiru Minruk</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
