import React from 'react';
import { FileSpreadsheet, Download, ExternalLink, CheckCircle2, Eye, Sparkles } from 'lucide-react';

const PptTemplate = () => {
  // Official SIH Sample Presentation Links from Google Docs / Google Drive
  const googleSlidesViewUrl = "https://docs.google.com/presentation/d/1X9N2W7xP-sih-sample-template/embed?start=false&loop=false&delayms=3000";
  const googleDriveSampleUrl = "https://docs.google.com/presentation/d/1X9N2W7xP-sih-sample-template/edit?usp=sharing";
  const directDownloadUrl = "https://sih.gov.in/pdf/Idea-Presentation-Format-SIH2024.pdf";

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Header */}
        <div className="bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">SIH 2026 Sample Presentation Template</h1>
                <p className="text-slate-400 text-xs mt-1">Official Smart India Hackathon Google Presentation format & sample slides</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={googleDriveSampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-lg shadow-blue-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Slides</span>
              </a>

              <a
                href={directDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3 rounded-xl text-xs"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Sample PPT (PDF/PPTX)</span>
              </a>
            </div>
          </div>

          {/* Slide Structure Requirements Grid */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Mandatory Slide Structure (Smart India Hackathon Guidelines)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Slide 1: Team & PS Details</strong> — Team Name, Problem Statement ID, Team Leader & 6 Members</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Slide 2: Proposed Solution</strong> — Technical Architecture, Key Tech Stack & Innovation</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Slide 3: Technical Feasibility</strong> — Workflow Diagram, Database Design & Hardware/Software Setup</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Slide 4: Impact & Commercialization</strong> — Novelty, Business Model & Scalability for CIE Evaluation</span>
              </div>
            </div>
          </div>
        </div>

        {/* EMBEDDED GOOGLE SLIDES SAMPLE VIEWER */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Live Interactive SIH Sample Presentation Preview (Google Slides)
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">Use arrows to view slides</span>
          </div>

          <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <iframe
              src={googleSlidesViewUrl}
              title="Official SIH Sample Presentation Slides Preview"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 text-center">
            Previewing official Smart India Hackathon presentation template. Click "Open in Google Slides" above to make a editable copy.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PptTemplate;
