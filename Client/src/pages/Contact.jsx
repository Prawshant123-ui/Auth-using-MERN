import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaGraduationCap } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="min-h-screen bg-gray-100 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div className="text-center mb-12">
          <FaGraduationCap className="text-6xl text-indigo-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Contact <span className="text-indigo-500">SkulManage</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We’re here to help! Reach out to us for inquiries, support, or
            collaboration opportunities. Our team will get back to you promptly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-indigo-500 text-2xl" />
              <p className="text-gray-700">123 SkulManage St, Education City, Nepal</p>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-indigo-500 text-2xl" />
              <p className="text-gray-700">support@skulmanage.com</p>
            </div>
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-indigo-500 text-2xl" />
              <p className="text-gray-700">+977 123 456 789</p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows="5"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-500 transition shadow-md"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;
