import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Lightbulb, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: About Organizations */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group inline-flex">
              <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 group-hover:border-cyan-500 transition-colors">
                <img
                  src="/cc_logo.jpg"
                  alt="Coders' Club"
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                />
                <span className="text-slate-500 text-xs font-bold">×</span>
                <img
                  src="/cie_logo.jpg"
                  alt="Centre for Entrepreneurship (CIE)"
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 font-bold text-lg tracking-tight">
                  <span className="text-white">SIH 2026</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">Portal</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Coders Club × CIE</p>
              </div>
            </Link>
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

          {/* Col 3: Contact & Queries Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Queries</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Email:</span>
                  <a href="mailto:codersclub@gprec.ac.in" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                    codersclub@gprec.ac.in
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone No:</span>
                  <div className="flex flex-col space-y-1">
                    <a href="tel:7416420488" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                      +91 74164 20488
                    </a>
                    <a href="tel:8106471349" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                      +91 81064 71349
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Address:</span>
                  <span className="text-slate-300">
                    CSM Block,<br />
                    G. Pulla Reddy Engineering College
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>© 2026 Smart India Hackathon Portal. Coders Club × Centre for Entrepreneurship (CIE).</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="inline-flex flex-col justify-center px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-300 font-medium shadow-sm">
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                <span>🚀 Created by</span>
                <span className="text-white font-semibold underline decoration-cyan-400 decoration-1 underline-offset-2">Asma Eram</span>
                <span className="text-slate-400 text-[11px]">(Full Stack Developer)</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1 sm:pl-6 mt-0.5">
                <span className="text-cyan-400">•</span>
                <span>Student Co-ordinator of CodersClub</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-slate-400">
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
