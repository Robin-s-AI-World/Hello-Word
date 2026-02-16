import React, { useState, useEffect } from 'react';
import './FullWebApp.css';
import { LiturgicalEngineInterface, LiturgicalData } from '@core/services/liturgicalEngineInterface.web';

const VERSION = '0.2.0';
const BUILD_NUMBER = Math.floor(Date.now() / 60000) % 100000;
const COPYRIGHT = 'Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  created_at: string;
}

type ViewMode = 'splash' | 'home' | 'missal' | 'calendar' | 'prayers' | 'profile' | 'mass-timeline' | 'mass-text';

// Material icon helper
const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Chi-Rho SVG Component
const ChiRhoSVG = ({ className = '' }: { className?: string }) => (
  <svg
    fill="currentColor"
    height="120"
    viewBox="0 0 100 100"
    width="120"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M50 10V90M50 10C65 10 75 20 75 35C75 50 65 60 50 60" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    <path d="M30 75L70 25M30 25L70 75" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    <path d="M20 50L25 40L30 50M22 47H28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <path d="M70 50C70 45 72 40 75 40C78 40 80 45 80 50H78" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
);

// Mass timeline section data
const MASS_SECTIONS = {
  catechumens: [
    { id: 'prayers', name: 'Prayers at the Foot of the Altar', type: 'ordinary', icon: 'church' },
    { id: 'introit', name: 'Introit', type: 'proper', latin: 'Introitus' },
    { id: 'kyrie', name: 'Kyrie', type: 'ordinary' },
    { id: 'gloria', name: 'Gloria', type: 'ordinary' },
    { id: 'collect', name: 'Collect', type: 'proper', latin: 'Collecta' },
    { id: 'epistle', name: 'Epistle', type: 'proper', latin: 'Lectio Epistolae', icon: 'menu_book', major: true },
    { id: 'gospel', name: 'Gospel', type: 'proper', latin: 'Initium Sancti Evangelii', icon: 'auto_stories', major: true },
    { id: 'credo', name: 'Credo', type: 'ordinary' },
  ],
  faithful: [
    { id: 'offertory', name: 'Offertory', type: 'proper', latin: 'Offertorium' },
    { id: 'secret', name: 'Secret', type: 'proper', latin: 'Secreta' },
    { id: 'preface', name: 'Preface', type: 'proper', latin: 'Praefatio' },
    { id: 'sanctus', name: 'Sanctus', type: 'ordinary', icon: 'notifications_active' },
    { id: 'canon', name: 'The Canon', type: 'solemn', latin: 'Canon Missae', icon: 'workspace_premium', gold: true },
    { id: 'pater', name: 'Pater Noster', type: 'ordinary' },
    { id: 'agnus', name: 'Agnus Dei', type: 'ordinary' },
  ],
  communion: [
    { id: 'communion', name: 'Communion', type: 'proper', icon: 'local_cafe', major: true },
    { id: 'postcommunion', name: 'Postcommunion', type: 'proper' },
    { id: 'lastgospel', name: 'Last Gospel', type: 'ordinary', faded: true },
  ],
};

function ActualLiturgicalApp(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('splash');
  const [todayInfo, setTodayInfo] = useState<LiturgicalData | null>(null);
  const [tomorrowInfo, setTomorrowInfo] = useState<LiturgicalData | null>(null);
  const [currentWeekDays, setCurrentWeekDays] = useState<LiturgicalData[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function initializeApp() {
      try {
        setIsLoading(true);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const todayData = await LiturgicalEngineInterface.getCalendarData(todayStr);
        if (isMounted && todayData) setTodayInfo(todayData);

        const tomorrowData = await LiturgicalEngineInterface.getCalendarData(tomorrowStr);
        if (isMounted && tomorrowData) setTomorrowInfo(tomorrowData);

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekDays: LiturgicalData[] = [];
        for (let i = 0; i < 7; i++) {
          const wd = new Date(weekStart);
          wd.setDate(weekStart.getDate() + i);
          const data = await LiturgicalEngineInterface.getCalendarData(wd.toISOString().split('T')[0]);
          if (data) weekDays.push(data);
        }
        if (isMounted) setCurrentWeekDays(weekDays);

        const saved = localStorage.getItem('sanctissimissa_journal');
        if (saved) try { setJournalEntries(JSON.parse(saved)); } catch {}

        if (isMounted) setIsLoading(false);
      } catch (e: any) {
        if (isMounted) { setError(e.message); setIsLoading(false); }
      }
    }
    initializeApp();
    return () => { isMounted = false; };
  }, []);

  const handleAddJournalEntry = () => {
    if (!journalTitle.trim() || !journalContent.trim()) return;
    const newEntry: JournalEntry = {
      id: `journal_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: journalTitle.trim(),
      content: journalContent.trim(),
      created_at: new Date().toISOString()
    };
    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem('sanctissimissa_journal', JSON.stringify(updated));
    setJournalTitle('');
    setJournalContent('');
  };

  // ── Splash Screen ────────────────────────────────────────────────────────
  const renderSplash = () => (
    <div
      className="min-h-screen bg-background-dark flex flex-col items-center justify-between relative overflow-hidden cursor-pointer"
      onClick={() => !isLoading && setCurrentView('home')}
    >
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_rgba(26,30,38,1)_0%,_rgba(15,18,22,1)_100%)]" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-8">
        {/* Chi-Rho */}
        <div className="mb-10 text-liturgical-gold opacity-90 animate-pulse-slow">
          <ChiRhoSVG />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-display-decorative font-semibold tracking-widest text-white text-center mb-2 text-glow">
          MISSALE
        </h1>
        <p className="text-primary-dim font-display-decorative text-sm tracking-[0.2em] uppercase mb-12">
          Romanum
        </p>

        {/* Loading dots or tap prompt */}
        {isLoading ? (
          <div className="flex items-center gap-1 h-1">
            <div className="w-1.5 h-1.5 rounded-full bg-liturgical-gold/50 animate-bounce-stagger-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-liturgical-gold/50 animate-bounce-stagger-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-liturgical-gold/50 animate-bounce-stagger-3" />
          </div>
        ) : (
          <p className="text-gray-500 text-sm animate-pulse">Tap anywhere to continue</p>
        )}
      </div>

      {/* Bottom section */}
      <div className="relative z-10 w-full px-6 pb-12 flex flex-col items-center">
        <button
          onClick={(e) => { e.stopPropagation(); setShowAboutModal(true); }}
          className="cursor-pointer group flex items-center gap-2 px-6 py-3 rounded-full bg-surface-dark/50 hover:bg-surface-dark border border-white/5 hover:border-liturgical-gold/20 transition-all duration-300"
        >
          <Icon name="info" className="text-primary-dim text-lg group-hover:text-liturgical-gold transition-colors" />
          <span className="font-body text-sm text-text-secondary group-hover:text-text-primary tracking-wide transition-colors">
            About
          </span>
        </button>
        <p className="mt-6 text-[10px] text-text-muted uppercase tracking-widest opacity-60">
          Ad Maiorem Dei Gloriam
        </p>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="relative z-50 w-full max-w-sm bg-surface-modal rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h2 className="font-display-decorative text-lg text-liturgical-gold tracking-wide">About Missale</h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="text-center pb-4 border-b border-white/5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-dark border border-liturgical-gold/20 mb-3">
                  <span className="font-display-decorative text-liturgical-gold text-xl font-bold">M</span>
                </div>
                <p className="text-text-primary font-medium">Missale Romanum</p>
                <p className="text-text-muted text-xs mt-1">Version {VERSION} (Build {BUILD_NUMBER})</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Development</h3>
                  <p className="text-sm text-text-primary leading-relaxed">
                    SanctissiMissa - Traditional Latin Liturgical Companion. Dedicated to preserving the liturgical heritage of the Church through technology.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Texts & Translation</h3>
                  <p className="text-sm text-text-primary leading-relaxed">
                    Latin texts from the 1962 Missale Romanum. English translations adapted from the Douay-Rheims Bible and the Lasance Missal.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Legal</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {COPYRIGHT}<br/>
                    Imprimatur for original texts remains with their respective ecclesiastical authorities.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-lg bg-surface-dark hover:bg-black/40 border border-white/10 text-sm text-text-secondary hover:text-liturgical-gold transition-colors flex items-center justify-center gap-2">
                  <Icon name="privacy_tip" className="text-base" />
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-dark/50 px-6 py-4 border-t border-white/5 text-center">
              <p className="text-[10px] text-text-muted">Soli Deo Gloria</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading && currentView !== 'splash') {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center">
        <div className="loading-spinner mb-4" />
        <p className="text-gray-400 text-sm">Loading Traditional Latin Calendar...</p>
        <p className="text-gray-600 text-xs mt-1">Calculating liturgical dates for {new Date().getFullYear()}</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center px-6">
        <Icon name="error" className="text-4xl text-red-400 mb-4" />
        <p className="text-red-400 text-lg font-bold mb-2">Liturgical Calendar Error</p>
        <p className="text-gray-400 text-sm text-center max-w-md">{error}</p>
      </div>
    );
  }

  // ── Mass Timeline View ───────────────────────────────────────────────────
  const renderMassTimeline = () => {
    const liturgicalColor = todayInfo?.calendar.color || 'green';
    const colorClass = liturgicalColor === 'green' ? 'liturgical-green' :
                       liturgicalColor === 'white' ? 'gray-200' :
                       liturgicalColor === 'red' ? 'red-500' :
                       liturgicalColor === 'violet' ? 'purple-500' : 'liturgical-green';

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display antialiased flex flex-col">
        {/* Top App Bar */}
        <div className="relative z-20 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setCurrentView('missal')}
            className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon name="arrow_back" className="text-2xl" />
          </button>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Ordo Missae
          </h2>
          <button className="flex size-12 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <Icon name="settings" className="text-[#92a4c9] text-2xl" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
          {/* Liturgical Header Info */}
          <div className="px-6 pt-6 pb-2 text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${colorClass}/20 border border-${colorClass}/30 mb-3`}>
              <Icon name="circle" className={`text-${colorClass} text-[18px]`} />
              <span className={`text-${colorClass} text-xs font-bold uppercase tracking-wide`}>
                {todayInfo?.calendar.rank || 'Class II'} • {liturgicalColor.charAt(0).toUpperCase() + liturgicalColor.slice(1)}
              </span>
            </div>
            <h2 className="text-gray-900 dark:text-white text-[28px] font-bold leading-tight mb-1">
              {todayInfo?.primaryCelebrationName || 'Sunday Mass'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              {todayInfo?.date || new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Start Button */}
          <div className="px-6 py-4 flex justify-center">
            <button
              onClick={() => setCurrentView('mass-text')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <Icon name="play_arrow" />
              <span>Start Mass</span>
            </button>
          </div>

          {/* Timeline Container */}
          <div className="relative px-6 mt-4">
            {/* SECTION 1: Mass of the Catechumens */}
            {renderTimelineSection('I', 'Mass of the Catechumens', MASS_SECTIONS.catechumens, colorClass)}

            {/* SECTION 2: Mass of the Faithful */}
            {renderTimelineSection('II', 'Mass of the Faithful', MASS_SECTIONS.faithful, colorClass)}

            {/* SECTION 3: Communion & Conclusion */}
            {renderTimelineSection('III', 'Communion', MASS_SECTIONS.communion, colorClass, true)}
          </div>
        </main>

        {/* Floating Action Button */}
        <div className="absolute bottom-6 right-6 z-30">
          <button className="flex items-center justify-center w-14 h-14 bg-surface-dark dark:bg-white text-white dark:text-black rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95">
            <Icon name="bookmark" className="text-[28px]" />
          </button>
        </div>
      </div>
    );
  };

  // Helper for timeline section rendering
  const renderTimelineSection = (
    numeral: string,
    title: string,
    items: any[],
    colorClass: string,
    isLast: boolean = false
  ) => (
    <div className={`${isLast ? '' : 'mb-2'}`}>
      <h3 className="text-gray-900 dark:text-white text-xl font-bold px-2 mb-4 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-surface-dark flex items-center justify-center text-xs font-bold text-gray-500">
          {numeral}
        </span>
        {title}
      </h3>
      <div className="grid grid-cols-[40px_1fr] gap-x-4">
        {/* Line segment */}
        <div className="relative flex flex-col items-center">
          <div className={`absolute ${isLast ? 'top-4 bottom-8' : 'top-4 bottom-0'} w-[2px] bg-${colorClass}/50`} />

          {/* Nodes */}
          {items.map((item, idx) => {
            if (item.icon) {
              return (
                <div
                  key={item.id}
                  className={`relative z-10 ${item.gold ? 'w-12 h-12' : item.major ? 'w-8 h-8' : 'w-8 h-8'} rounded-full ${
                    item.gold
                      ? `bg-liturgical-gold shadow-lg shadow-yellow-500/20 ring-4 ring-yellow-500/10`
                      : item.major
                        ? `bg-${colorClass} shadow-md shadow-${colorClass}/20`
                        : `bg-background-light dark:bg-background-dark border-2 border-${colorClass}`
                  } flex items-center justify-center ${idx < items.length - 1 ? 'mb-10' : ''} ${idx === 0 ? 'mt-1' : ''} shadow-sm`}
                >
                  <Icon
                    name={item.icon}
                    className={`${item.gold ? 'text-white text-[24px]' : item.major ? 'text-white text-[16px]' : `text-${colorClass} text-[16px]`}`}
                  />
                </div>
              );
            }
            return (
              <div
                key={item.id}
                className={`relative z-10 ${item.faded ? 'w-3 h-3 bg-' + colorClass + '/50' : 'w-3 h-3 bg-' + colorClass} rounded-full ${idx < items.length - 1 ? 'mb-10' : ''} ${idx === 0 ? 'mt-1' : ''}`}
              />
            );
          })}
        </div>

        {/* Text segment */}
        <div className={`pb-6 ${items[0]?.icon ? '' : 'pt-0'}`}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`${item.major ? 'h-10' : item.icon ? 'h-10' : 'h-4'} flex flex-col justify-center ${idx < items.length - 1 ? 'mb-10' : ''} ${idx === 0 && items[0]?.icon ? 'mt-1' : idx === 0 ? '' : ''} cursor-pointer group`}
            >
              <div className="flex justify-between items-center w-full pr-4">
                <div>
                  <p className={`text-gray-900 dark:text-white ${item.gold ? 'text-xl font-bold uppercase tracking-widest text-liturgical-gold' : item.major ? 'text-lg font-bold' : item.icon ? 'text-base font-medium' : 'text-base font-normal'} leading-none group-hover:text-primary transition-colors`}>
                    {item.name}
                  </p>
                  {item.latin && (
                    <p className="text-gray-500 text-sm mt-1">{item.latin}</p>
                  )}
                  {item.type === 'ordinary' && !item.latin && (
                    <p className="text-gray-500 text-sm mt-1">Ordinary</p>
                  )}
                </div>
                {item.type === 'proper' && (
                  <span className={`text-xs text-${colorClass} bg-${colorClass}/10 px-1.5 py-0.5 rounded border border-${colorClass}/20`}>
                    Proper
                  </span>
                )}
                {item.type === 'ordinary' && !item.major && !item.icon && (
                  <span className="text-xs text-gray-500">Ordinary</span>
                )}
                {item.type === 'solemn' && (
                  <span className="text-xs text-liturgical-gold bg-liturgical-gold/10 px-2 py-1 rounded border border-liturgical-gold/20 font-bold">
                    Solemn
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Mass Text View (Interactive) ──────────────────────────────────────────
  const renderMassText = () => (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display antialiased flex flex-col">
      {/* Header with Progress */}
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-lg shadow-black/5">
        <div className="flex items-center justify-between p-4 pb-2">
          <button
            onClick={() => setCurrentView('mass-timeline')}
            className="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" className="text-2xl" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs font-sans font-medium uppercase tracking-widest text-primary">Sunday Mass</span>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
              Ordinary of the Mass
            </h1>
          </div>
          <button className="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <Icon name="settings" className="text-2xl" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="relative w-full h-16 flex items-center px-4 bg-background-light dark:bg-background-dark overflow-hidden">
          <div className="absolute top-[28px] left-8 right-8 h-[1px] bg-primary-glow/50 dark:bg-primary-glow/40 z-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <div className="w-full flex justify-between items-start pt-1 h-full z-10 px-2">
            {['Asperges', 'Introit', 'Kyrie', 'Gloria', 'Collect', 'Epistle'].map((step, idx) => (
              <button key={step} className={`group flex flex-col items-center gap-2 cursor-pointer focus:outline-none w-12 ${idx === 1 ? '-mt-1' : idx === 0 ? '' : 'opacity-50 hover:opacity-100'}`}>
                <div className={`relative flex items-center justify-center ${idx === 1 ? '' : ''}`}>
                  {idx === 1 && (
                    <>
                      <div className="absolute w-8 h-8 bg-primary-glow rounded-full animate-ping opacity-20" />
                      <div className="absolute w-5 h-5 bg-primary-glow rounded-full animate-pulse opacity-40" />
                    </>
                  )}
                  <div className={`${idx === 1 ? 'w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_12px_#22d3ee] ring-2 ring-background-light dark:ring-background-dark' : idx === 0 ? 'w-2 h-2 bg-primary shadow-[0_0_8px_#3b82f6] ring-4 ring-background-light dark:ring-background-dark' : 'w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 ring-4 ring-background-light dark:ring-background-dark'} rounded-full relative z-10`} />
                </div>
                <span className={`text-[${idx === 1 ? '9px' : '8px'}] font-sans font-${idx <= 1 ? 'bold' : 'medium'} uppercase tracking-wider ${idx === 1 ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : idx === 0 ? 'text-primary opacity-80' : 'text-gray-500 dark:text-gray-400'} truncate w-full text-center ${idx === 1 ? 'mt-1.5' : ''}`}>
                  {step}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-32">
        {/* Rubric Section */}
        <section className="border-b border-gray-200 dark:border-white/5 py-8">
          <div className="w-full max-w-md mx-auto px-4 mb-6">
            <p className="text-rubric font-serif italic text-sm text-center font-medium">
              [The Priest stands at the foot of the altar.]
            </p>
          </div>

          {/* Two-column Latin/English */}
          <div className="grid grid-cols-2 gap-6 px-4 max-w-lg mx-auto">
            <div className="text-gray-900 dark:text-text-latin text-lg leading-relaxed text-left drop-cap">
              In nómine Patris, et Fílii, et Spíritus Sancti. Amen.
            </div>
            <div className="text-gray-600 dark:text-text-english text-base leading-relaxed italic text-left pt-1 font-light">
              In the name of the Father, and of the Son, and of the Holy Ghost. Amen.
            </div>
          </div>
        </section>

        {/* Psalm Section */}
        <section className="py-8 relative">
          <div className="w-full max-w-md mx-auto px-4 mb-8">
            <h2 className="text-rubric font-serif font-bold text-2xl sm:text-3xl text-center uppercase tracking-wide leading-tight drop-shadow-sm">
              Psalm 42:1-5
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 px-4 max-w-lg mx-auto">
            <div className="text-gray-900 dark:text-text-latin text-lg leading-relaxed text-left">
              <p className="mb-4">
                Introíbo ad altáre <span className="bg-primary/30 text-white rounded px-0.5 cursor-pointer border-b-2 border-primary">Dei</span>.
              </p>
              <p>Ad Deum qui lætíficat juventútem meam.</p>
            </div>
            <div className="text-gray-600 dark:text-text-english text-base leading-relaxed italic text-left font-light">
              <p className="mb-4">I will go in to the altar of God.</p>
              <p>To God, the joy of my youth.</p>
            </div>
          </div>
        </section>

        {/* More Latin/English sections */}
        <section className="py-8 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="grid grid-cols-2 gap-6 px-4 max-w-lg mx-auto">
            <div className="text-gray-900 dark:text-text-latin text-lg leading-relaxed text-left">
              Júdica me, Deus, et discérne causam meam de gente non sancta: ab hómine iníquo, et dolóso érue me.
            </div>
            <div className="text-gray-600 dark:text-text-english text-base leading-relaxed italic text-left font-light">
              Judge me, O God, and distinguish my cause from the nation that is not holy: deliver me from the unjust and deceitful man.
            </div>
          </div>
        </section>
      </main>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30">
        <Icon name="add" className="text-3xl" />
      </button>

      {/* Bottom Nav */}
      {renderBottomNav()}
    </div>
  );

  // ── Home View ─────────────────────────────────────────────────────────────
  const renderHomeView = () => (
    <div className="px-6 py-6 space-y-6">
      {/* Today Card */}
      {todayInfo && (
        <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">Today</span>
            <span className="text-[10px] text-gray-500">{todayInfo.date}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">
            {todayInfo.primaryCelebrationName || 'Feria'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
              {todayInfo.calendar.season}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: todayInfo.calendar.color === 'white' ? '#f0f0f0' : todayInfo.calendar.color }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentView('mass-timeline')}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-primary/20 transition-colors"
        >
          <Icon name="menu_book" className="text-primary text-3xl" />
          <span className="text-white font-medium text-sm">View Mass</span>
        </button>
        <button
          onClick={() => setCurrentView('calendar')}
          className="bg-surface-dark/50 border border-white/5 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-surface-dark transition-colors"
        >
          <Icon name="calendar_month" className="text-gray-400 text-3xl" />
          <span className="text-white font-medium text-sm">Calendar</span>
        </button>
      </div>

      {/* This Week */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">This Week</h3>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1" />
        </div>
        <div className="space-y-2">
          {currentWeekDays.slice(0, 5).map((day) => {
            const isToday = day.date === todayInfo?.date;
            return (
              <div
                key={day.date}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isToday
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-surface-dark/30 border border-white/5 hover:bg-surface-dark/50'
                }`}
              >
                <span className={`text-xs font-mono w-20 ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
                  {day.date.slice(5)}
                </span>
                <span className={`text-sm flex-1 ${isToday ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {day.primaryCelebrationName || 'Feria'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Calendar View ────────────────────────────────────────────────────────
  const renderCalendarView = () => (
    <div className="px-6 py-6 space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">Liturgical Calendar</h2>

      {/* Today Card */}
      {todayInfo && (
        <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">Today</span>
            <span className="text-[10px] text-gray-500">{todayInfo.date}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">
            {todayInfo.primaryCelebrationName || 'Feria'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
              {todayInfo.calendar.season}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: todayInfo.calendar.color === 'white' ? '#f0f0f0' : todayInfo.calendar.color }}
            />
          </div>
        </div>
      )}

      {/* Week View */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">This Week</h3>
        <div className="space-y-2">
          {currentWeekDays.map((day) => {
            const isToday = day.date === todayInfo?.date;
            return (
              <div
                key={day.date}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isToday
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-surface-dark/30 border border-white/5 hover:bg-surface-dark/50'
                }`}
              >
                <span className={`text-xs font-mono w-20 ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
                  {day.date.slice(5)}
                </span>
                <span className={`text-sm flex-1 ${isToday ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {day.primaryCelebrationName || 'Feria'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Prayers View ──────────────────────────────────────────────────────────
  const renderPrayersView = () => (
    <div className="px-6 py-6 space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">Prayers</h2>

      <div className="space-y-3">
        {[
          { name: 'Pater Noster', latin: 'Our Father' },
          { name: 'Ave Maria', latin: 'Hail Mary' },
          { name: 'Credo', latin: 'Apostles\' Creed' },
          { name: 'Confiteor', latin: 'I Confess' },
          { name: 'Salve Regina', latin: 'Hail Holy Queen' },
        ].map((prayer) => (
          <div key={prayer.name} className="bg-surface-dark/50 border border-white/5 rounded-lg p-4 hover:border-primary/30 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center group-hover:border-primary/50">
                <Icon name="auto_stories" className="text-gray-500 group-hover:text-primary text-sm" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{prayer.name}</h4>
                <p className="text-[10px] text-gray-500">{prayer.latin}</p>
              </div>
              <Icon name="chevron_right" className="text-gray-600 group-hover:text-primary text-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Profile View ──────────────────────────────────────────────────────────
  const renderProfileView = () => (
    <div className="px-6 py-6 space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">Profile</h2>

      <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">About</h3>
        <div className="space-y-2 text-sm">
          <p className="text-white font-display text-lg">SanctissiMissa</p>
          <p className="text-gray-400">Traditional Latin Liturgical Companion</p>
          <p className="text-gray-500 text-xs">Version {VERSION} (Build {BUILD_NUMBER})</p>
          <p className="text-gray-500 text-xs">{COPYRIGHT}</p>
          <p className="text-gray-500 text-xs">Target: 1962 Missal and Breviary (Extraordinary Form)</p>
        </div>
      </div>

      <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Color Palette</h3>
        <div className="flex gap-4">
          {[
            { color: '#1152d4', label: 'Primary' },
            { color: '#2d6a4f', label: 'Green' },
            { color: '#d4af37', label: 'Gold' },
            { color: '#f87171', label: 'Rubric' },
          ].map(({ color, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full border border-white/20" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Bottom Navigation ─────────────────────────────────────────────────────
  const renderBottomNav = () => (
    <nav className="fixed bottom-0 w-full z-50 bg-background-light/95 dark:bg-[#0c111a]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 pb-safe pt-2 pb-5">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {([
          { view: 'home' as ViewMode, icon: 'home', label: 'Home' },
          { view: 'missal' as ViewMode, icon: 'menu_book', label: 'Missal' },
          { view: 'calendar' as ViewMode, icon: 'calendar_month', label: 'Calendar' },
          { view: 'prayers' as ViewMode, icon: 'favorite', label: 'Prayers' },
          { view: 'profile' as ViewMode, icon: 'person', label: 'Profile' },
        ]).map(({ view, icon, label }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${
              currentView === view
                ? 'text-primary dark:text-white'
                : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white'
            }`}
          >
            <Icon name={icon} className={`text-[26px] ${currentView === view ? 'fill-current' : ''}`} />
            <span className={`text-[10px] font-sans ${currentView === view ? 'font-bold' : 'font-medium'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );

  // ── Missal View (Entry Point) ─────────────────────────────────────────────
  const renderMissalView = () => (
    <div className="px-6 py-6 space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">Missal</h2>

      {/* Today's Mass */}
      <button
        onClick={() => setCurrentView('mass-timeline')}
        className="w-full bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-center gap-4 hover:bg-primary/20 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Icon name="play_arrow" className="text-primary text-2xl" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-white font-bold">Today's Mass</h3>
          <p className="text-gray-400 text-sm">{todayInfo?.primaryCelebrationName || 'Loading...'}</p>
        </div>
        <Icon name="chevron_right" className="text-primary text-xl" />
      </button>

      {/* Ordo Missae */}
      <button
        onClick={() => setCurrentView('mass-timeline')}
        className="w-full bg-surface-dark/50 border border-white/5 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center">
          <Icon name="menu_book" className="text-gray-400 text-2xl" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-white font-bold">Ordo Missae</h3>
          <p className="text-gray-400 text-sm">Ordinary of the Mass</p>
        </div>
        <Icon name="chevron_right" className="text-gray-600 text-xl" />
      </button>

      {/* Divine Office */}
      <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-bold mb-4">Divine Office</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Matins', 'Lauds', 'Prime', 'Terce', 'Sext', 'None', 'Vespers', 'Compline'].map((hour) => (
            <button
              key={hour}
              className="bg-surface-highlight border border-white/5 rounded-lg p-3 text-left hover:border-primary/30 transition-colors"
            >
              <span className="text-white text-sm">{hour}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Main Render Logic ─────────────────────────────────────────────────────
  if (currentView === 'splash') {
    return renderSplash();
  }

  if (currentView === 'mass-timeline') {
    return renderMassTimeline();
  }

  if (currentView === 'mass-text') {
    return renderMassText();
  }

  // ── Main Layout with Bottom Nav ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background-dark flex flex-col max-w-lg mx-auto border-x border-white/5 relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Sanctissimissa</span>
          <h1 className="text-white text-sm font-semibold">Traditional Latin Liturgy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'missal' && renderMissalView()}
        {currentView === 'calendar' && renderCalendarView()}
        {currentView === 'prayers' && renderPrayersView()}
        {currentView === 'profile' && renderProfileView()}
      </main>

      {/* Bottom Nav */}
      {renderBottomNav()}
    </div>
  );
}

export default ActualLiturgicalApp;
