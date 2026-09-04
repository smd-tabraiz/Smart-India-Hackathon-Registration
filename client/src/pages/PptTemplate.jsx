import React from 'react';
import { Download, ExternalLink, Sparkles, CheckCircle2, Presentation } from 'lucide-react';

const PptTemplate = () => {
  const pptDownloadUrl = "/SIH2026-IDEA-Presentation-Format.pptx";
  const googleDriveSampleUrl = "https://docs.google.com/presentation/d/1Bv5uDwTC8kJJMgljx0dtSGhXE69v6j30/edit?usp=sharing&ouid=111454085469850450471&rtpof=true&sd=true";

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Banner */}
        <div className="bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30 shrink-0">
                <Presentation className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">SIH 2026 Idea Presentation Template</h1>
                <p className="text-slate-400 text-xs mt-1">
                  Official Smart India Hackathon Idea Presentation Format provided by <strong>Coders Club & CIE</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Official Template:</strong> Includes all mandatory sections required by the Ministry of Education & SIH 2026 evaluation jury.
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>Standard 16:9 Widescreen</span>
            </div>
          </div>
        </div>

        {/* LIVE INTERACTIVE PREVIEW CARD - SHOWING ACTUAL PPT */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-7 mb-8">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Live Interactive Preview</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Official Presentation
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                SIH 2026 Idea Presentation Format (.PPTX)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={googleDriveSampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Open in Google Slides</span>
              </a>
              <a
                href={pptDownloadUrl}
                download="SIH2026-IDEA-Presentation-Format.pptx"
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .PPTX</span>
              </a>
            </div>
          </div>

          {/* Actual PPT Embedded Frame */}
          <div className="relative w-full aspect-video sm:aspect-[16/9] min-h-[460px] sm:min-h-[540px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <iframe
              src="https://drive.google.com/file/d/1Bv5uDwTC8kJJMgljx0dtSGhXE69v6j30/preview"
              title="Official SIH 2026 Presentation Format PPT"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Interactive preview of the actual SIH presentation file. You can scroll through slides, zoom, or click above to edit and download.
          </p>
        </div>



      </div>
    </div>
  );
};

export default PptTemplate;
