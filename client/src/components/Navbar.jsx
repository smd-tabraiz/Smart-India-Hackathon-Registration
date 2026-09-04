import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Code2, Lightbulb, LogOut, Menu, X, LayoutDashboard, FileText, ChevronDown, FileSpreadsheet } from 'lucide-react';

const Navbar = () => {
  const { user, team, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Brand Logos */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center space-x-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/60 group-hover:border-cyan-500 transition-colors">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/terms"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/terms') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Terms & Conditions
            </Link>
            <Link
              to="/ppt-template"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/ppt-template') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              PPT Template
            </Link>
            <Link
              to="/faq"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/faq') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              FAQs
            </Link>
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-xl text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white text-sm shadow">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white max-w-[130px] truncate">{user.email}</p>
                    <p className="text-[10px] text-cyan-400 font-medium">
                      {user.role === 'admin' ? 'System Admin' : team?.teamId || 'Team Leader'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {user.role === 'admin' ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-blue-400" />
                          Admin Dashboard
                        </Link>
                        <a
                          href="https://docs.google.com/spreadsheets/d/1vdoZzJwKesxhg62k0j876eg0H-kUSDJKd-biVDo2dZ8/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white"
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-2.5 text-emerald-400" />
                          Live Excel Sheet
                        </a>
                      </>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5 text-blue-400" />
                        Dashboard
                      </Link>
                    )}
                    <div className="border-t border-slate-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Leader Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-blue-500/20 transition-all transform active:scale-95"
                >
                  Register Team
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            About Us
          </Link>
          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-cyan-400 hover:bg-slate-800"
          >
            Team Registration
          </Link>
          <Link
            to="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/ppt-template"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            PPT Template
          </Link>
          <Link
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            FAQs
          </Link>
          
          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-slate-800"
                >
                  Dashboard ({user.role === 'admin' ? 'Admin' : team?.teamId || 'Leader'})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200 font-semibold"
                >
                  Leader Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
