import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-6">Terms & Conditions</h1>
        <p className="text-xs text-slate-400 mb-8">Smart India Hackathon 2026 Nomination Regulations - Coders Club × CIE</p>

        <div className="space-y-6 text-sm text-slate-300">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              1. Team Size & Gender Inclusion
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Each team must consist of exactly six (6) full-time enrolled students. At least one (1) female student must be part of the team. Teams failing to satisfy the female student mandate will be automatically disqualified.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              2. Roll Number Uniqueness & Single Registration
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              A student roll number can only belong to one single team. Registration of the same student across multiple teams is strictly prohibited and will result in cancellation of all affected team registrations.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              3. Attendance & Evaluation Presentation
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              All 6 team members must be present during the internal pitch evaluations conducted by the Coders' Club and Centre for Entrepreneurship (CIE). Presentations must follow the official PPT template format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
