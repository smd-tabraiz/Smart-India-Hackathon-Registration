import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, ExternalLink, CheckCircle2, Eye, Sparkles, 
  ChevronLeft, ChevronRight, Presentation, ShieldCheck, Layers, Cpu, HelpCircle, TrendingUp
} from 'lucide-react';

const SLIDES = [
  {
    slideNumber: 1,
    title: "Slide 1: Title & Team Overview",
    badge: "MANDATORY COVER",
    desc: "Official cover slide containing essential team identification and problem statement details.",
    points: [
      "Team Name & Unique Server Team ID (e.g. SIH26-CC-XXXX)",
      "Problem Statement ID & Title from SIH 2026 Portal",
      "Theme & Category (Software / Hardware / Student Innovation)",
      "Team Leader Name, Roll Number, Branch & Contact Email",
      "All 5 Registered Team Members with Branches & Academic Year (Min 1 Female Student)",
      "Organizing Entity: Coders Club × Centre for Entrepreneurship (CIE)"
    ],
    sampleBox: {
      tag: "Title Slide Sample",
      content: "Team: [Your Team Name] | PS ID: [SIH2026_XXXX] | Leader: [Leader Name] (CSE 3rd Yr) | 6 Members Listed"
    }
  },
  {
    slideNumber: 2,
    title: "Slide 2: Problem Description & Idea Overview",
    badge: "PROBLEM & VISION",
    desc: "Clearly define the core problem you are solving and your innovative value proposition.",
    points: [
      "Precise Problem Statement breakdown — what pain points currently exist?",
      "Why is the existing solution inadequate or inefficient?",
      "Your Proposed Value Proposition — 2-sentence summary of your novel approach",
      "Key Beneficiaries & Target Stakeholders (Government, Industry, Citizens, Students)"
    ],
    sampleBox: {
      tag: "Idea Summary",
      content: "Our system automates [Key Bottleneck] using [Core Technology], reducing response latency by 60% and ensuring verifiable tamper-proof records."
    }
  },
  {
    slideNumber: 3,
    title: "Slide 3: Proposed Solution & Technical Architecture",
    badge: "CORE ARCHITECTURE",
    desc: "Comprehensive technical diagram showing how data flows between components.",
    points: [
      "System Architecture Diagram (Frontend, API Gateway, Backend Microservices, DB)",
      "Tech Stack Breakdown: Frameworks, Libraries, ML Models / Cloud Services",
      "Database Design (Schema relationships, caching, real-time sync)",
      "APIs and Protocols (REST, WebSockets, gRPC, OAuth2)"
    ],
    sampleBox: {
      tag: "Architecture Spec",
      content: "Client (React + Vite) ↔ REST / WS ↔ Express API Gateway ↔ MongoDB Atlas + ML Inference Engine"
    }
  },
  {
    slideNumber: 4,
    title: "Slide 4: Technical Feasibility & Flowchart",
    badge: "WORKFLOW & FEASIBILITY",
    desc: "Demonstrate that your solution is realistic, buildable, and technically sound within 36 hours.",
    points: [
      "Step-by-step User Journey & System Process Flowchart",
      "Hardware / Cloud resource requirements and cost feasibility",
      "Deployment Topology (Docker, AWS/GCP Free Tier, edge devices)",
      "Latency, throughput, and concurrent user handling benchmarks"
    ],
    sampleBox: {
      tag: "Process Flow",
      content: "User input → Validation → Model Inference → Real-time State Update → Push Notification to Client"
    }
  },
  {
    slideNumber: 5,
    title: "Slide 6: Novelty, Impact & Business Potential",
    badge: "CIE EVALUATION FOCUS",
    desc: "High priority slide for Centre for Entrepreneurship (CIE) commercial viability scoring.",
    points: [
      "What makes your solution unique compared to commercial market alternatives?",
      "Quantifiable Impact: Time saved, costs minimized, accuracy improved",
      "Business Model & Commercialization Pathway (SaaS, Open Core, Institutional Licensing)",
      "Scalability Strategy for Pan-India deployment"
    ],
    sampleBox: {
      tag: "Incubation Readiness",
      content: "Estimated deployment cost: Low | Potential IP / Patent applicability | Incubator readiness via CIE"
    }
  },
  {
    slideNumber: 6,
    title: "Slide 6: Challenges, Security & Mitigations",
    badge: "RISK ANALYSIS",
    desc: "Anticipate technical roadblocks and outline your mitigation strategies.",
    points: [
      "Data privacy, encryption at rest and in transit (AES-256, TLS 1.3)",
      "Edge case handling & fault tolerance (Fallback modes, offline sync)",
      "Regulatory compliance (DPDP Act, GDPR if applicable)",
      "Scalability challenges during peak query loads"
    ],
    sampleBox: {
      tag: "Risk Mitigation",
      content: "Rate-limiting prevents DoS attacks | In-memory fallback guarantees 99.9% uptime during network dropouts"
    }
  }
];

const PptTemplate = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'googleSlides'

  const pptDownloadUrl = "/SIH2026-IDEA-Presentation-Format.pptx";
  const googleDriveSampleUrl = "https://docs.google.com/presentation/d/1B4wXGjNlQ5zM5jL_SIH2026_Sample/edit?usp=sharing";
  const googleSlidesEmbed = "https://docs.google.com/presentation/d/1B4wXGjNlQ5zM5jL_SIH2026_Sample/embed?start=false&loop=false&delayms=3000";

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const current = SLIDES[activeSlide];

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
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">SIH 2026 Idea Presentation Template</h1>
                  <span className="hidden sm:inline bg-cyan-500/20 text-cyan-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/30">
                    Official .PPTX
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  Official Smart India Hackathon Idea Presentation Format provided by <strong>Coders Club & CIE</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={pptDownloadUrl}
                download="SIH2026-IDEA-Presentation-Format.pptx"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold px-5 py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>Download SIH PPTX (924 KB)</span>
              </a>

              <a
                href={googleDriveSampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-3 rounded-xl text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Open in Google Slides</span>
              </a>
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

        {/* INTERACTIVE PRESENTATION PREVIEW CARD */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-7 mb-8">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Live Interactive Preview</span>
                <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  Slide {activeSlide + 1} of {SLIDES.length}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {current.title}
              </h2>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'interactive' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive Slides
              </button>
              <button
                onClick={() => setViewMode('googleSlides')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'googleSlides' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Google Slides Embed
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: INTERACTIVE SLIDE DECK */}
          {viewMode === 'interactive' && (
            <div>
              {/* Slide Screen Canvas */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 min-h-[360px] flex flex-col justify-between shadow-inner">
                
                {/* Top slide bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-xs text-slate-500 font-mono ml-2">SIH2026-IDEA-Presentation-Format.pptx</span>
                  </div>
                  <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">
                    {current.badge}
                  </span>
                </div>

                {/* Slide Content */}
                <div className="space-y-4 my-auto">
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {current.desc}
                  </p>

                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-2.5">
                      Key Content Elements for this Slide:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                      {current.points.map((pt, i) => (
                        <li key={i} className="flex items-start space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Snippet Callout */}
                  <div className="bg-blue-950/30 border border-blue-500/30 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                    <div className="p-1 bg-blue-500/20 text-blue-400 rounded shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-blue-300 font-bold block mb-0.5">{current.sampleBox.tag}:</strong>
                      <span className="text-slate-300 font-mono text-[11px]">{current.sampleBox.content}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom slide info */}
                <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <span>Smart India Hackathon 2026 • Coders Club × CIE</span>
                  <span className="font-mono">Slide {activeSlide + 1} of {SLIDES.length}</span>
                </div>
              </div>

              {/* Slider Navigation Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        activeSlide === idx ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Jump to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={prevSlide}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Slide</span>
                  </button>

                  <button
                    onClick={nextSlide}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 transition-colors"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: GOOGLE SLIDES / OFFICE VIEWER EMBED */}
          {viewMode === 'googleSlides' && (
            <div>
              <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                <iframe
                  src={googleSlidesEmbed}
                  title="Official SIH Sample Presentation Slides Preview"
                  className="w-full h-full border-0"
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 text-center">
                Embedded Google Slides Viewer. You can also click "Download SIH PPTX" above to open the exact file directly in PowerPoint.
              </p>
            </div>
          )}

        </div>

        {/* Download File Card */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Direct Download Ready</h3>
              <p className="text-xs text-slate-400">File: <span className="font-mono text-cyan-300">SIH2026-IDEA-Presentation-Format.pptx</span> (924 KB)</p>
            </div>
          </div>

          <a
            href={pptDownloadUrl}
            download="SIH2026-IDEA-Presentation-Format.pptx"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Presentation File</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default PptTemplate;
