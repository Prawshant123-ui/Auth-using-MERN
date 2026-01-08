import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [mode, setMode] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, getAuthState } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password || (mode === "Sign Up" && !name)) {
      toast.error("All fields are required");
      return;
    }

    try {
      const endpoint =
        mode === "Sign Up" ? "/api/auth/register" : "/api/auth/login";

      const payload =
        mode === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        payload,
        { withCredentials: true } // ✅ important for cookie-based auth
      );

      if (data.success) {
        await getAuthState(); // This will update both isLoggedIn and userData
        toast.success(data.message || "Success");
        navigate("/");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Authentication failed";
      toast.error(message);
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "Sign Up" ? "Create Account" : "Login"}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === "Sign Up"
              ? "Sign up to access SkulManage"
              : "Login to your SkulManage account"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "Sign Up" && (
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {mode === "Login" && (
            <div className="text-right">
              <Link
                to="/reset-password"
                className="text-sm text-indigo-500 hover:text-indigo-600 transition"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition shadow-md"
          >
            {mode === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          {mode === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() =>
              setMode(mode === "Sign Up" ? "Login" : "Sign Up")
            }
            className="text-indigo-500 cursor-pointer hover:text-indigo-600 transition font-semibold"
          >
            {mode === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
