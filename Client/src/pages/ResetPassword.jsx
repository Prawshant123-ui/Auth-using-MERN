import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeydown = (e, index) => {
    if (e.key === "Backspace" && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("Text");
    const arr = text.split("");
    arr.forEach((item, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = item;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success(data.message || "OTP sent");
        setStep(2);
      } else {
        toast.error(data.message || "Unable to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otp = inputRefs.current.map((item) => item.value).join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, newPassword, otp }
      );

      if (data.success) {
        toast.success(data.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Reset Password
        </h1>
        <p className="text-center text-gray-500 mt-2">
          {step === 1
            ? "Enter your registered email to get an OTP."
            : "Enter the OTP and choose a new password."}
        </p>

        {step === 1 && (
          <form className="mt-8 space-y-4" onSubmit={onSubmitEmail}>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-4" onSubmit={onSubmitNewPassword}>
            <div>
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <div
                className="flex justify-between gap-2"
                onPaste={handlePaste}
                aria-label="Reset password OTP input"
              >
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      ref={(el) => (inputRefs.current[index] = el)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeydown(e, index)}
                    />
                  ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="********"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;