import React from 'react';
import { ExperimentResult } from '../types';
import { normalPdf } from '../utils/statistics';

interface SamplingDistributionChartProps {
  result: ExperimentResult;
  showNormalCurve?: boolean;
}

export const SamplingDistributionChart: React.FC<SamplingDistributionChartProps> = ({
  result,
  showNormalCurve = true,
}) => {
  const meta = result.variableMeta;
  const bins = result.histogramBins;
  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  // SVG configuration
  const svgWidth = 720;
  const svgHeight = 320;
  const padding = { top: 35, right: 35, bottom: 50, left: 55 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  // X range from first bin min to last bin max
  const xMin = bins.length > 0 ? bins[0].min : result.populationMean - 5;
  const xMax = bins.length > 0 ? bins[bins.length - 1].max : result.populationMean + 5;
  const xRange = xMax - xMin || 1;

  const getX = (val: number) => {
    return padding.left + ((val - xMin) / xRange) * innerWidth;
  };

  const getY = (count: number) => {
    return padding.top + innerHeight - (count / maxCount) * innerHeight;
  };

  const popMeanX = getX(result.populationMean);
  const meanOfMeansX = getX(result.meanOfSampleMeans);

  // Normal curve generation
  // To scale PDF onto the histogram: area under histogram = totalSamples * binWidth
  const binWidth = bins.length > 0 ? bins[0].max - bins[0].min : 1;
  const curvePoints: { x: number; y: number }[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const val = xMin + (i / steps) * xRange;
    const pdf = normalPdf(val, result.populationMean, result.theoreticalSE);
    // expected frequency in bin around val = pdf * totalSamples * binWidth
    const expectedCount = pdf * result.numSamples * binWidth;
    const px = getX(val);
    const py = getY(expectedCount);
    curvePoints.push({ x: px, y: Math.max(padding.top - 5, py) });
  }

  const pathD = curvePoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  // Y axis ticks (0, 25%, 50%, 75%, 100% of maxCount)
  const yTicks = [
    0,
    Math.round(maxCount * 0.33),
    Math.round(maxCount * 0.66),
    maxCount,
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            Distribution of Sample Means
          </h4>
          <p className="text-xs text-slate-500">
            Histogram of {result.numSamples} simulated sample means (sample size n = {result.sampleSize})
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-500 inline-block"></span>
            <span className="text-slate-600 font-medium">Sample Means Histogram</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-rose-500 inline-block"></span>
            <span className="text-slate-600 font-medium">CLT Normal Curve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-700 inline-block"></span>
            <span className="text-slate-600 font-medium">μ Pop Mean</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-700 inline-block"></span>
            <span className="text-slate-600 font-medium">x̄̄ Mean of Means</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto flex justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-3xl h-auto select-none"
          role="img"
          aria-label="Sampling distribution histogram of sample means"
        >
          {/* Y Axis Gridlines */}
          {yTicks.map((tick, i) => {
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
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Histogram Bins */}
          {bins.map((bin, i) => {
            const x0 = getX(bin.min);
            const x1 = getX(bin.max);
            const width = Math.max(1, x1 - x0 - 1.5);
            const y = getY(bin.count);
            const height = padding.top + innerHeight - y;

            return (
              <g key={i} className="group">
                <rect
                  x={x0 + 0.75}
                  y={y}
                  width={width}
                  height={height}
                  fill="#6366F1"
                  opacity="0.8"
                  rx="2"
                  className="transition-opacity hover:opacity-100 cursor-pointer"
                >
                  <title>
                    Bin: {bin.min.toFixed(2)} - {bin.max.toFixed(2)} {meta.unit}
                    Count: {bin.count} samples ({bin.frequency.toFixed(1)}%)
                  </title>
                </rect>
                {/* Count label above tallest bins */}
                {bin.count > 0 && (
                  <text
                    x={x0 + width / 2}
                    y={y - 4}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {bin.count}
                  </text>
                )}
              </g>
            );
          })}

          {/* Theoretical Central Limit Theorem Normal Curve */}
          {showNormalCurve && (
            <path
              d={pathD}
              fill="none"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Population Mean Vertical Line (Blue) */}
          {popMeanX >= padding.left && popMeanX <= svgWidth - padding.right && (
            <g>
              <line
                x1={popMeanX}
                y1={padding.top}
                x2={popMeanX}
                y2={padding.top + innerHeight}
                stroke="#1E1B4B"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx={popMeanX} cy={padding.top} r="4" fill="#1E1B4B" />
              <text
                x={popMeanX}
                y={padding.top - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-900 font-mono"
              >
                μ = {result.populationMean.toFixed(meta.decimalPlaces)}
              </text>
            </g>
          )}

          {/* Mean of Sample Means Vertical Line (Purple) */}
          {meanOfMeansX >= padding.left && meanOfMeansX <= svgWidth - padding.right && (
            <g>
              <line
                x1={meanOfMeansX}
                y1={padding.top}
                x2={meanOfMeansX}
                y2={padding.top + innerHeight}
                stroke="#9333EA"
                strokeWidth="2"
              />
              <circle cx={meanOfMeansX} cy={padding.top + 10} r="4" fill="#9333EA" />
              <text
                x={meanOfMeansX}
                y={padding.top - 18}
                textAnchor="middle"
                className="text-[10px] font-bold fill-purple-700 font-mono"
              >
                x̄̄ = {result.meanOfSampleMeans.toFixed(meta.decimalPlaces)}
              </text>
            </g>
          )}

          {/* X Axis Baseline */}
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={svgWidth - padding.right}
            y2={padding.top + innerHeight}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* X Axis Ticks */}
          {bins.filter((_, idx) => idx % Math.max(1, Math.floor(bins.length / 6)) === 0).map((b, i) => {
            const x = getX(b.min);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padding.top + innerHeight}
                  x2={x}
                  y2={padding.top + innerHeight + 4}
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + innerHeight + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-mono"
                >
                  {b.min.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* X-axis title */}
          <text
            x={padding.left + innerWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            className="text-xs font-semibold fill-slate-700"
          >
            Sample Mean Values ({meta.label} in {meta.unit})
          </text>
        </svg>
      </div>

      {/* Axis notes */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          Theoretical Standard Error: <span className="font-mono font-bold text-slate-800">{result.theoreticalSE.toFixed(2)}</span> · 
          Empirical Std Dev of Means: <span className="font-mono font-bold text-slate-800">{result.empiricalStdDev.toFixed(2)}</span>
        </div>
        <div className="text-slate-600">
          Convergence Error: <span className="font-mono font-bold text-emerald-700">|x̄̄ - μ| = {Math.abs(result.meanOfSampleMeans - result.populationMean).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
