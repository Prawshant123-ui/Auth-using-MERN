import React from "react";
import { FaGraduationCap, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* Brand */}
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 border-b border-gray-700 pb-6">
          <div className="flex items-center gap-3 text-white">
            <FaGraduationCap className="text-2xl text-indigo-500" />
            <span className="text-xl font-bold tracking-wide">
              Skul<span className="text-indigo-500">Manage</span>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 text-gray-400 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-2">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} SkulManage. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
