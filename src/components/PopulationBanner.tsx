import React from 'react';
import { RefreshCw, Users, Database, Sparkles, Table } from 'lucide-react';

interface PopulationBannerProps {
  populationSize: number;
  onSizeChange: (size: number) => void;
  onRegenerate: () => void;
  onOpenDataModal: () => void;
  isGenerating?: boolean;
}

export const PopulationBanner: React.FC<PopulationBannerProps> = ({
  populationSize,
  onSizeChange,
  onRegenerate,
  onOpenDataModal,
  isGenerating = false,
}) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Population title & disclaimer */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Simulated Population: {populationSize.toLocaleString()} Students
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Dataset
                </span>
              </div>
              <p className="text-xs text-slate-500">
                This is simulated educational data and does not represent real students.
              </p>
            </div>
          </div>

          {/* Right: Controls (choose size, regenerate button, view data) */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Population Size Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <span className="text-xs text-slate-500 px-2 font-medium hidden sm:inline">Size:</span>
              {[500, 1000, 2000, 5000].map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    populationSize === size
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {size.toLocaleString()}
                </button>
              ))}
            </div>

            {/* View Records Modal Trigger */}
            <button
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Inspect individual student records"
            >
              <Table className="w-3.5 h-3.5 text-slate-500" />
              <span>Inspect Data</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Generate New College Data</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
