import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Lightbulb, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About Organizations */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1 rounded-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="bg-amber-500 text-white p-1 rounded-lg">
                <Lightbulb className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SIH 2026</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Smart India Hackathon internal nomination and team registration platform organized by 
              <strong className="text-slate-200"> Coders Club</strong> in collaboration with 
              <strong className="text-slate-200"> Centre for Entrepreneurship (CIE)</strong>.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">About Coders Club & CIE</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-400 font-medium transition-colors">Team Registration</Link>
              </li>
              <li>
                <Link to="/ppt-template" className="hover:text-blue-400 transition-colors">SIH PPT Template</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms & Rules</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">sih2026@codersclub.edu.in</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">+91 98765 43210 / +91 98123 45678</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Centre for Entrepreneurship (CIE),<br />
                  Innovation Block, Campus Ground Floor
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Admin & Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Portals & Social</h3>
            <div className="space-y-3 text-xs mb-4">
              <Link
                to="/admin/login"
                className="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3.5 py-2 rounded-lg font-medium transition-colors"
              >
                🔐 Faculty / Admin Login
              </Link>
            </div>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>© 2026 Smart India Hackathon Portal. Coders Club × Centre for Entrepreneurship (CIE).</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-cyan-300 font-medium shadow-sm">
              <span>🚀 Created by</span>
              <span className="text-white font-semibold underline decoration-cyan-400 decoration-1 underline-offset-2">Asma Eram</span>
              <span className="text-slate-400 text-[11px]">(Full Stack Developer)</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-slate-400">
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Guidelines</Link>
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
