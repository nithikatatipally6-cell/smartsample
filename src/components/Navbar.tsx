import React from 'react';
import { Database, RefreshCw, BarChart2 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'analyze' | 'experiment' | 'about';
  setCurrentTab: (tab: 'home' | 'analyze' | 'experiment' | 'about') => void;
  populationSize: number;
  onRegenerate: () => void;
  onOpenDataModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  populationSize,
  onRegenerate,
  onOpenDataModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                SmartSample
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2 font-medium">
                College Statistics Platform
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentTab('home')}
            className={`transition-colors pb-0.5 border-b-2 ${
              currentTab === 'home'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('analyze')}
            className={`transition-colors pb-0.5 border-b-2 ${
              currentTab === 'analyze'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Analyze
          </button>
          <button
            onClick={() => setCurrentTab('experiment')}
            className={`transition-colors pb-0.5 border-b-2 ${
              currentTab === 'experiment'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Sampling Experiment
          </button>
          <button
            onClick={() => setCurrentTab('about')}
            className={`transition-colors pb-0.5 border-b-2 ${
              currentTab === 'about'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDataModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Inspect Simulated Student Population Records"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Population:</span>
            <span className="font-semibold tabular-nums">{populationSize.toLocaleString()}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            title="Regenerate college student population"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Data</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex border-t border-slate-100 bg-slate-50/80 px-4 py-2 justify-around text-xs font-medium text-slate-600">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-2 py-1 rounded ${currentTab === 'home' ? 'text-indigo-600 font-bold bg-indigo-50' : 'hover:text-slate-900'}`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentTab('analyze')}
          className={`px-2 py-1 rounded ${currentTab === 'analyze' ? 'text-indigo-600 font-bold bg-indigo-50' : 'hover:text-slate-900'}`}
        >
          Analyze
        </button>
        <button
          onClick={() => setCurrentTab('experiment')}
          className={`px-2 py-1 rounded ${currentTab === 'experiment' ? 'text-indigo-600 font-bold bg-indigo-50' : 'hover:text-slate-900'}`}
        >
          Experiment
        </button>
        <button
          onClick={() => setCurrentTab('about')}
          className={`px-2 py-1 rounded ${currentTab === 'about' ? 'text-indigo-600 font-bold bg-indigo-50' : 'hover:text-slate-900'}`}
        >
          About
        </button>
      </div>
    </header>
  );
};
