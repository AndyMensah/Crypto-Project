// pages/SignUp.jsx — Registration page
// Connects to POST /api/register and POST /api/verify-email on the backend.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function SignUp() {
  const [step, setStep] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation before hitting the backend
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/register", { name, email, password });
      setUserId(response.data.userId);
      setStep("otp");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/verify-email", { userId, otp });
      // Redirect to sign in page after successful verification
      navigate("/signin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Demo warning banner — assignment requirement */}
      <div className="bg-yellow-50 border-b border-yellow-200 text-center py-2 px-4 text-sm text-yellow-800">
        Demo app – do not use your real password. This is a student project.
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and heading */}
          <div className="text-center mb-8">
            <svg
              width="44"
              height="44"
              viewBox="0 0 40 40"
              fill="none"
              className="mx-auto mb-4"
            >
              <title>CryptoApp Logo</title>
              <circle cx="20" cy="20" r="20" fill="#0052FF" />
              <path
                d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6zm-3.6 16.8a3.6 3.6 0 110-7.2h7.2a3.6 3.6 0 110 7.2h-7.2z"
                fill="white"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {step === "register" ? "Create account" : "Verify Email"}
            </h1>
          </div>

          {step === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name field — required for backend registration */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Your full name"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  placeholder="At least 6 characters"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Confirm password field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Confirm your password"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Error message */}
              {error && (
                <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors mt-6"
              >
                {submitting ? "Creating account..." : "Sign up"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter the OTP sent to your email (check server console)
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  placeholder="e.g. 123456"
                  required
                  disabled={submitting}
                />
              </div>

              {error && (
                <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors mt-6"
              >
                {submitting ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )}

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
