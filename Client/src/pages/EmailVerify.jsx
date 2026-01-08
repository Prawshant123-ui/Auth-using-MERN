import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData, getAuthState } =
    useContext(AppContext);
  const inputRefs = useRef([]);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  const handleInput = (e, index) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
    
    if (value.length > 0 && inputRefs.current[index + 1]) {
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
    // Extract only numbers and limit to 6 digits
    const numbers = text.replace(/[^0-9]/g, '').slice(0, 6);
    const arr = numbers.split("");
    arr.forEach((item, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = item;
        // Focus the last filled input
        if (index === arr.length - 1) {
          inputRefs.current[index].focus();
        }
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const otp = inputRefs.current.map((item) => item.value).join("");
      
      if (otp.length !== 6) {
        toast.error("Please enter a complete 6-digit OTP");
        setSubmitting(false);
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-email`, {
        otp,
      });

      if (data.success) {
        toast.success(data.message || "Email verified");
        await getAuthState();
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);

      if (data.success) {
        toast.success(data.message || "OTP resent successfully");
        // Clear OTP inputs
        inputRefs.current.forEach((input) => {
          if (input) input.value = "";
        });
        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Verify your email
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Enter the 6-digit code sent to your email.
        </p>

        <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
          <div
            className="flex justify-between gap-2"
            onPaste={handlePaste}
            aria-label="OTP input"
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeydown(e, index)}
                />
              ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-sm text-indigo-500 hover:text-indigo-600 transition disabled:opacity-60"
          >
            {resending ? "Sending..." : "Didn't receive the code? Resend OTP"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmailVerify;