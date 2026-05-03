import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import API_BASE_URL from "../../lib/api.js";

export default function SignupOverlay({ isOpen, onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onClose();
      navigate("/upload-dataset");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Create Account
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          onClick={handleGoogleRegister}
          className="w-full mt-4 py-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6 text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <button
            onClick={() => onSwitchToLogin && onSwitchToLogin()}
            className="text-[#2563EB] font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
