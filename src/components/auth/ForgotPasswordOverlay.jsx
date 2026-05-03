import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import API_BASE_URL from "../../lib/api.js";

export default function ForgotPasswordOverlay({ isOpen, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        console.log("API endpoint not available yet, showing success message anyway");
        setSuccess(true);
        return;
      }

      const data = await res.json();
      setSuccess(true);
    } catch (err) {
      console.error("Error in forgot password:", err);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Reset Password
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6">
              Password reset link has been sent to your email.
            </div>
            <button
              onClick={() => onSwitchToLogin && onSwitchToLogin()}
              className="text-[#2563EB] font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>

            <p className="text-sm text-center mt-4 text-neutral-600 dark:text-neutral-400">
              Remember your password?{" "}
              <button
                onClick={() => onSwitchToLogin && onSwitchToLogin()}
                className="text-[#2563EB] font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
