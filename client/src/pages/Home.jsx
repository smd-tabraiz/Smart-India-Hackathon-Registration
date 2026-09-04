import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Award, ShieldCheck, ArrowRight, CheckCircle2, FileSpreadsheet, MessageSquare, AlertCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Smart India Hackathon 2026 Internal Nominations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Coders Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-400">× CIE</span> Registration Portal
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Register your 6-member student team for internal hackathon evaluation. Accelerate your problem statements with innovation and engineering excellence.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Register Team Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/ppt-template"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-base px-7 py-4 rounded-xl transition-all"
            >
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              <span>Download PPT Template</span>
            </Link>
          </div>

          {/* Key Mandatory Highlight Banner */}
          <div className="mt-12 max-w-3xl mx-auto bg-slate-800/80 border border-cyan-500/40 rounded-2xl p-4 sm:p-6 backdrop-blur flex flex-col sm:flex-row items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Mandatory Team Structure Rule</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded">SIH Norms</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Each team MUST consist of <strong>EXACTLY 6 students</strong>, with <strong>at least ONE female student</strong>. Duplicate roll numbers or incomplete teams will be auto-rejected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Register Through This Portal?</h2>
            <p className="text-slate-400 text-sm mt-2">Streamlined internal selection process by Coders Club & Centre for Entrepreneurship</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Automated Validation</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Real-time validation for exact 6 members, female participant mandate, and roll number uniqueness to ensure submission compliance.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant Leader Access</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Receive server-generated Team ID (SIH26-CC-XXXX), confirmation email, and exclusive access to the official Team Leaders WhatsApp Group.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Internal Evaluation</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Expert mentoring and evaluation by Centre for Entrepreneurship (CIE) faculty and senior Coders Club mentors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
