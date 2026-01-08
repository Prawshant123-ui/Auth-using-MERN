import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaGraduationCap,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    userData,
    backendUrl,
    setUserData,
    setIsLoggedIn,
  } = useContext(AppContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const sendVeificationotp = async () => {
    setDropdownOpen(false); // Close dropdown
    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to send verification OTP");
    }
  };

  const handleLogoutClick = async () => {
    setDropdownOpen(false); // Close dropdown
    await handleLogout();
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  return (
    <header className="w-full bg-gray-900 shadow-lg fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 text-white group">
          <FaGraduationCap className="text-2xl text-indigo-500 group-hover:text-indigo-400 transition" />
          <span className="text-xl font-bold tracking-wide">
            Skul<span className="text-indigo-500">Manage</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-10">
          <ul className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <FaHome />
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <FaInfoCircle />
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <FaEnvelope />
                Contact
              </Link>
            </li>
          </ul>

          {/* Auth Section */}
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold cursor-pointer hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                {userData?.name?.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <ul className="py-2 text-gray-700">
                    {!userData.isAccountVerified && (
                      <li 
                        onClick={sendVeificationotp} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                      >
                        Verify Email
                      </li>
                    )}
                    <li
                      onClick={handleLogoutClick}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 transition"
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition shadow-md"
            >
              <FaSignInAlt />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
