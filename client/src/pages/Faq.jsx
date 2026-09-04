import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: "What is the mandatory team composition for SIH 2026?",
    a: "Every registered team must have EXACTLY 6 student members, and at least ONE member must be female."
  },
  {
    q: "Can a student register in more than one team?",
    a: "No. Each student Roll Number is strictly tied to one registered team. The portal will reject duplicate roll numbers."
  },
  {
    q: "What happens after our team registers on this portal?",
    a: "The Team Leader receives a unique Team ID (e.g. SIH26-CC-0001), confirmation email, and access to the official Team Leaders WhatsApp Group for internal evaluation schedules."
  },
  {
    q: "Where can we download the presentation format?",
    a: "You can download the official SIH 2026 PPT Template directly from the 'PPT Template' page on this portal."
  },
  {
    q: "Can team leaders modify team members after registering?",
    a: "No. Once a team registration is submitted, team member details cannot be modified by the team leader to ensure data integrity during internal evaluation by CIE & Coders Club mentors. Only designated administrators can update team details if required."
  }
];

const Faq = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-400 mt-1">Common queries regarding SIH 2026 internal nominations</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm hover:bg-slate-900/60 transition-colors"
              >
                <span>{f.q}</span>
                {openIdx === idx ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
