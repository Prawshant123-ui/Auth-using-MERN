import React from "react";
import { FaGraduationCap, FaUsers, FaChalkboardTeacher, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <section className="min-h-screen bg-gray-100 text-gray-900 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Hero */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <FaGraduationCap className="text-6xl text-indigo-500" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            About <span className="text-indigo-500">SkulManage</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            SkulManage is a centralized platform designed to streamline educational
            management for students, teachers, and administrators. Our mission is
            to simplify communication, attendance, and analytics in one secure, 
            easy-to-use system.
          </p>
        </div>

        {/* Features / Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition">
            <FaUsers className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student-Centric</h3>
            <p className="text-gray-600 text-sm">
              Empower students with easy access to notes, attendance records, and
              performance analytics.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition">
            <FaChalkboardTeacher className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Teacher Empowerment</h3>
            <p className="text-gray-600 text-sm">
              Teachers can manage classes, send notices, and track student progress
              effortlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition">
            <FaLightbulb className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Insightful Analytics</h3>
            <p className="text-gray-600 text-sm">
              Administrators and educators get actionable insights to improve
              learning outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
