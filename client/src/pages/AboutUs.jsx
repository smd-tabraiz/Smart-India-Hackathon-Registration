import React from 'react';
import { Code2, Lightbulb, Target, Users, ShieldCheck, Award } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About Coders Club & Centre for Entrepreneurship (CIE)
          </h1>
          <p className="text-slate-400 mt-3 text-sm max-w-2xl mx-auto">
            Empowering student innovators for Smart India Hackathon 2026 through technical mentorship, domain expertise, and entrepreneurial incubation.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coders Club</h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              Coders Club is the premier student-led technical community dedicated to nurturing coding excellence, algorithmic problem solving, full-stack software engineering, and competitive programming. We organize internal hackathons, code sprints, and technical workshops.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Centre for Entrepreneurship (CIE)</h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              CIE serves as the institutional incubator promoting student startups, patent support, product design, and industry-academia collaborations. CIE provides guidance for SIH team nominations, prototype funding, and commercialization pathways.
            </p>
          </div>
        </div>

        {/* SIH Objectives */}
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Smart India Hackathon 2026 Nomination Guidelines
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span><strong>Team Composition:</strong> Teams must consist of strictly 6 members enrolled in undergraduate/postgraduate programs.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span><strong>Gender Diversity Mandate:</strong> Inclusion of at least 1 female member is mandatory per Ministry of Education SIH guidelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span><strong>Idea Submission:</strong> Presentations must adhere strictly to the standardized PPT template provided by the organizers.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
