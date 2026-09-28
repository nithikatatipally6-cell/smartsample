import React from 'react';
import { BarChart2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'analyze' | 'experiment' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm tracking-tight">SmartSample</span>
          <span className="text-xs text-slate-500">· College Student Analytics & Statistical Estimation Platform</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('analyze')} className="hover:text-slate-900 transition-colors">
            Analyze
          </button>
          <button onClick={() => onNavigate('experiment')} className="hover:text-slate-900 transition-colors">
            Sampling Experiment
          </button>
          <button onClick={() => onNavigate('about')} className="hover:text-slate-900 transition-colors">
            About
          </button>
        </div>

        {/* Note */}
        <div className="text-xs text-slate-400">
          Simulated educational statistics tool
        </div>

      </div>
    </footer>
  );
};
