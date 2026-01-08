import React, { useContext } from "react";
import { FaGraduationCap, FaUsers, FaChalkboardTeacher, FaChartLine } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const { userData, authLoading } = useContext(AppContext);

  // Optional: Show loader if auth state is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="flex justify-center mb-6">
          <FaGraduationCap className="text-6xl text-indigo-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Hey {userData?.name ? userData.name : "Guest"}, Welcome to{" "}
          <span className="text-indigo-500">SkulManage</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          A centralized platform to manage students, teachers, attendance,
          communication, and academic insights — all in one place.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition shadow-lg">
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-400 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
            <FaUsers className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student Management</h3>
            <p className="text-gray-400 text-sm">
              Track student profiles, performance, and engagement with
              real-time data access.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
            <FaChalkboardTeacher className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Teacher Dashboard</h3>
            <p className="text-gray-400 text-sm">
              Share notes, manage attendance, and communicate with students
              efficiently.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
            <FaChartLine className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-gray-400 text-sm">
              Visualize academic progress using charts and actionable metrics.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home;
