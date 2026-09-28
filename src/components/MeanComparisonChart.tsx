import React from 'react';
import { SampleAnalysisResult } from '../types';

interface MeanComparisonChartProps {
  result: SampleAnalysisResult;
}

export const MeanComparisonChart: React.FC<MeanComparisonChartProps> = ({ result }) => {
  const meta = result.variableMeta;
  const popMean = result.populationMean;
  const sampleMean = result.sampleMean;
  const [ciLower, ciUpper] = result.confidenceInterval;

  // Compute a clean Y axis min and max to frame both bars and the CI whisker nicely
  const minVal = Math.min(popMean, sampleMean, ciLower);
  const maxVal = Math.max(popMean, sampleMean, ciUpper);
  const spread = maxVal - minVal || 10;
  
  // Padding around data
  const yMin = Math.max(0, Math.floor(minVal - spread * 0.25));
  const yMax = Math.ceil(maxVal + spread * 0.25);
  const range = yMax - yMin;

  // Chart dimensions
  const svgWidth = 560;
  const svgHeight = 280;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const getY = (val: number) => {
    return padding.top + innerHeight - ((val - yMin) / range) * innerHeight;
  };

  const popY = getY(popMean);
  const sampleY = getY(sampleMean);
  const ciLowerY = getY(ciLower);
  const ciUpperY = getY(ciUpper);

  // Bar horizontal positions
  const barWidth = 72;
  const popBarX = padding.left + innerWidth * 0.28 - barWidth / 2;
  const sampleBarX = padding.left + innerWidth * 0.72 - barWidth / 2;

  // Axis grid ticks (4 ticks)
  const ticks = [
    yMin,
    yMin + range * 0.33,
    yMin + range * 0.66,
    yMax
  ];

  const diff = Math.abs(sampleMean - popMean);
  const unitStr = meta.unit === '%' ? '%' : ` ${meta.unit}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            Population Mean vs. Sample Mean
          </h4>
          <p className="text-xs text-slate-500">
            Visual comparison showing how close the sample estimate is to the true population value
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block"></span>
            <span className="text-slate-600 font-medium">Population Mean (μ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-purple-600 inline-block"></span>
            <span className="text-slate-600 font-medium">Sample Mean (x̄)</span>
          </div>
        </div>
      </div>

      {/* SVG Visualization */}
      <div className="w-full overflow-x-auto flex justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-xl h-auto select-none"
          role="img"
          aria-label="Population Mean vs Sample Mean bar comparison chart"
        >
          {/* Grid lines and Y axis ticks */}
          {ticks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {tick.toFixed(0)}
                  {meta.unit === '%' ? '%' : ''}
                </text>
              </g>
            );
          })}

          {/* Reference Population Mean guideline across chart */}
          <line
            x1={padding.left}
            y1={popY}
            x2={svgWidth - padding.right}
            y2={popY}
            stroke="#4F46E5"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Population Mean Bar */}
          <g>
            <rect
              x={popBarX}
              y={popY}
              width={barWidth}
              height={padding.top + innerHeight - popY}
              fill="#4F46E5"
              rx="4"
              className="transition-all duration-300"
            />
            {/* Value Label above bar */}
            <text
              x={popBarX + barWidth / 2}
              y={popY - 8}
              textAnchor="middle"
              className="text-xs font-bold fill-indigo-700 font-mono"
            >
              {popMean.toFixed(meta.decimalPlaces)}
              {unitStr}
            </text>
            <text
              x={popBarX + barWidth / 2}
              y={padding.top + innerHeight + 20}
              textAnchor="middle"
              className="text-xs font-semibold fill-slate-800"
            >
              Population Mean (μ)
            </text>
            <text
              x={popBarX + barWidth / 2}
              y={padding.top + innerHeight + 35}
              textAnchor="middle"
              className="text-[11px] fill-slate-500"
            >
              Entire N = {result.populationSize}
            </text>
          </g>

          {/* Sample Mean Bar */}
          <g>
            <rect
              x={sampleBarX}
              y={sampleY}
              width={barWidth}
              height={padding.top + innerHeight - sampleY}
              fill="#9333EA"
              rx="4"
              className="transition-all duration-300"
            />
            {/* Value Label above bar */}
            <text
              x={sampleBarX + barWidth / 2}
              y={sampleY - 8}
              textAnchor="middle"
              className="text-xs font-bold fill-purple-700 font-mono"
            >
              {sampleMean.toFixed(meta.decimalPlaces)}
              {unitStr}
            </text>
            <text
              x={sampleBarX + barWidth / 2}
              y={padding.top + innerHeight + 20}
              textAnchor="middle"
              className="text-xs font-semibold fill-slate-800"
            >
              Sample Mean (x̄)
            </text>
            <text
              x={sampleBarX + barWidth / 2}
              y={padding.top + innerHeight + 35}
              textAnchor="middle"
              className="text-[11px] fill-slate-500"
            >
              Sample n = {result.sampleSize}
            </text>
          </g>

          {/* Confidence Interval Error Whisker on Sample Bar */}
          <g>
            {/* Vertical stem */}
            <line
              x1={sampleBarX + barWidth / 2}
              y1={ciLowerY}
              x2={sampleBarX + barWidth / 2}
              y2={ciUpperY}
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Upper cap */}
            <line
              x1={sampleBarX + barWidth / 2 - 12}
              y1={ciUpperY}
              x2={sampleBarX + barWidth / 2 + 12}
              y2={ciUpperY}
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Lower cap */}
            <line
              x1={sampleBarX + barWidth / 2 - 12}
              y1={ciLowerY}
              x2={sampleBarX + barWidth / 2 + 12}
              y2={ciLowerY}
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Label for CI error whisker */}
            <text
              x={sampleBarX + barWidth + 14}
              y={(ciLowerY + ciUpperY) / 2 + 4}
              className="text-[10px] font-semibold fill-slate-700"
            >
              {result.confidenceLevel}% CI Whisker
            </text>
          </g>

        </svg>
      </div>

      {/* Difference Annotation Callout */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Estimation Accuracy:</span>
          <span>Difference between sample and population:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            |x̄ - μ| = {diff.toFixed(meta.decimalPlaces)} {meta.unit}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          {result.capturesPopulationMean ? (
            <span className="text-emerald-700 flex items-center gap-1">
              ✓ {result.confidenceLevel}% CI successfully captures true μ
            </span>
          ) : (
            <span className="text-amber-700 flex items-center gap-1">
              ⚠ Unlucky sample: true μ falls slightly outside this interval
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
