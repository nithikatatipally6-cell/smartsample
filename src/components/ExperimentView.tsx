import React, { useState, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Split, 
  TrendingDown, 
  BookOpen, 
  Info, 
  ArrowRight,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Student, VariableKey, ExperimentResult } from '../types';
import { VARIABLES, sampleSimpleRandom } from '../utils/populationGenerator';
import { calculateMean, calculateStdDev, calculateStandardError } from '../utils/statistics';
import { getEducationalTakeaway } from '../utils/formatters';
import { SamplingDistributionChart } from './SamplingDistributionChart';

interface ExperimentViewProps {
  students: Student[];
}

export const ExperimentView: React.FC<ExperimentViewProps> = ({ students }) => {
  const [selectedVariable, setSelectedVariable] = useState<VariableKey>('examMarks');
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [numSamples, setNumSamples] = useState<number>(100);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Comparison mode (n=30 vs n=200)
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [comparisonResults, setComparisonResults] = useState<{
    small: ExperimentResult;
    large: ExperimentResult;
  } | null>(null);

  // Helper to generate an experiment run
  function runExperiment(
    pop: Student[],
    variable: VariableKey,
    n: number,
    kSamples: number
  ): ExperimentResult {
    const meta = VARIABLES[variable];
    const popValues = pop.map((s) => s[variable]);
    const popMean = calculateMean(popValues);
    const popStdDev = calculateStdDev(popValues, false);
    const theoreticalSE = calculateStandardError(popStdDev, n);

    const sampleMeans: number[] = [];
    for (let i = 0; i < kSamples; i++) {
      const sample = sampleSimpleRandom(pop, n);
      const m = calculateMean(sample.map((s) => s[variable]));
      sampleMeans.push(m);
    }

    const meanOfSampleMeans = calculateMean(sampleMeans);
    const empiricalStdDev = calculateStdDev(sampleMeans, true);

    // Compute dynamic histogram bins
    const minMean = Math.min(...sampleMeans);
    const maxMean = Math.max(...sampleMeans);
    const spread = maxMean - minMean || 1;
    const numBins = Math.min(18, Math.max(10, Math.floor(Math.sqrt(kSamples) * 1.4)));
    const binWidth = spread / numBins;

    const bins: ExperimentResult['histogramBins'] = [];
    for (let b = 0; b < numBins; b++) {
      const bMin = minMean + b * binWidth;
      const bMax = b === numBins - 1 ? maxMean + 0.0001 : bMin + binWidth;
      const midpoint = (bMin + bMax) / 2;
      bins.push({
        min: bMin,
        max: bMax,
        midpoint,
        count: 0,
        frequency: 0,
      });
    }

    // Populate bin counts
    sampleMeans.forEach((val) => {
      const binIndex = bins.findIndex((b) => val >= b.min && val < b.max);
      if (binIndex !== -1) {
        bins[binIndex].count += 1;
      } else if (bins.length > 0) {
        bins[bins.length - 1].count += 1;
      }
    });

    bins.forEach((b) => {
      b.frequency = (b.count / kSamples) * 100;
    });

    return {
      variable,
      variableMeta: meta,
      sampleSize: n,
      numSamples: kSamples,
      populationMean: popMean,
      populationStdDev: popStdDev,
      meanOfSampleMeans,
      empiricalStdDev,
      theoreticalSE,
      sampleMeans,
      histogramBins: bins,
    };
  }

  // Active result state
  const [activeResult, setActiveResult] = useState<ExperimentResult>(() => {
    return runExperiment(students, 'examMarks', 50, 100);
  });

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runExperiment(students, selectedVariable, sampleSize, numSamples);
      setActiveResult(res);
      setIsRunning(false);
    }, 150);
  };

  const handleRunComparison = () => {
    setCompareMode(true);
    setIsRunning(true);
    setTimeout(() => {
      const small = runExperiment(students, selectedVariable, 30, numSamples);
      const large = runExperiment(students, selectedVariable, 200, numSamples);
      setComparisonResults({ small, large });
      setIsRunning(false);
    }, 200);
  };

  const currentMeta = VARIABLES[selectedVariable];
  const educationalTakeaways = useMemo(() => getEducationalTakeaway('samplingExperiment'), []);

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sampling Experiment & Central Limit Theorem
        </h1>
        <p className="text-base text-slate-600 mt-1">
          Explore how drawing repeated random samples creates a predictable bell-shaped Sampling Distribution centered on the population mean.
        </p>
      </div>

      {/* Experiment Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Experiment Setup</h2>
          </div>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              compareMode
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Exit Comparison Mode' : 'Compare Sample Sizes (n=30 vs n=200)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Variable Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Variable to Study
            </label>
            <select
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value as VariableKey)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            >
              <option value="examMarks">Exam Marks (35 - 100)</option>
              <option value="attendance">Attendance (50% - 100%)</option>
              <option value="studyHours">Study Hours per Day (1 - 10h)</option>
              <option value="sleepHours">Sleep Hours (4 - 9h)</option>
              <option value="commuteTime">Commute Time (5 - 120 min)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              {currentMeta.description}
            </p>
          </div>

          {/* Sample Size */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Sample Size (n per sample)
            </label>
            <select
              disabled={compareMode}
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors disabled:opacity-50"
            >
              <option value={30}>30 students (Small sample)</option>
              <option value={50}>50 students (Standard sample)</option>
              <option value={100}>100 students (Moderate sample)</option>
              <option value={200}>200 students (Large sample)</option>
              <option value={300}>300 students (Very large sample)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              {compareMode ? 'Locked: Comparing n=30 vs n=200' : 'Number of students drawn in each individual sample'}
            </p>
          </div>

          {/* Number of Samples */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Number of Samples to Draw
            </label>
            <select
              value={numSamples}
              onChange={(e) => setNumSamples(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            >
              <option value={50}>50 repeated samples</option>
              <option value={100}>100 repeated samples (Standard)</option>
              <option value={250}>250 repeated samples</option>
              <option value={500}>500 repeated samples (High Precision)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Each sample yields one independent sample mean (x̄)
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!compareMode ? (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Run Sampling Experiment</span>
              </button>
            ) : (
              <button
                onClick={handleRunComparison}
                disabled={isRunning}
                className="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-98 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Split className="w-4 h-4" />
                <span>Run n=30 vs n=200 Comparison</span>
              </button>
            )}

            <button
              onClick={() => {
                if (compareMode) {
                  handleRunComparison();
                } else {
                  handleRun();
                }
              }}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Re-run Draw</span>
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Total Student Draws:{' '}
            <span className="font-mono font-bold text-slate-800">
              {(compareMode ? (30 + 200) * numSamples : sampleSize * numSamples).toLocaleString()}
            </span>{' '}
            individual observations
          </div>
        </div>

      </div>

      {/* SINGLE EXPERIMENT DISPLAY */}
      {!compareMode && (
        <div className="space-y-8">
          
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* 1. Population Mean */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Population Mean (μ)
              </span>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {activeResult.populationMean.toFixed(currentMeta.decimalPlaces)}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  {currentMeta.unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                True target parameter from entire college population (N = {students.length})
              </p>
            </div>

            {/* 2. Mean of Sample Means */}
            <div className="bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 p-5 shadow-xs">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Mean of Sample Means (x̄̄)
              </span>
              <div className="text-3xl font-extrabold text-indigo-600 tabular-nums">
                {activeResult.meanOfSampleMeans.toFixed(currentMeta.decimalPlaces)}
                <span className="text-sm font-normal text-indigo-500 ml-1">
                  {currentMeta.unit}
                </span>
              </div>
              <p className="text-xs text-indigo-700/80 mt-2">
                Average across all {activeResult.numSamples} independent sample means
              </p>
            </div>

            {/* 3. Standard Error */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Standard Error (SE)
              </span>
              <div className="text-3xl font-extrabold text-purple-700 tabular-nums">
                {activeResult.theoreticalSE.toFixed(2)}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  {currentMeta.unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Theoretical SE = σ / √n = {activeResult.populationStdDev.toFixed(1)} / √{activeResult.sampleSize}
              </p>
            </div>

          </div>

          {/* Graph: Distribution of Sample Means */}
          <SamplingDistributionChart result={activeResult} />

          {/* What does this graph tell us? Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Central Limit Theorem Demonstration
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              What does this graph tell us?
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                Each point in this distribution represents the mean of one sample. As the number of samples increases, the sample means form a sampling distribution that becomes approximately normal under the conditions of the Central Limit Theorem.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h5 className="font-bold text-slate-900 text-sm mb-1">Unbiased Center Convergence</h5>
                  <p className="text-xs text-slate-600">
                    The center of the sampling distribution (x̄̄ = {activeResult.meanOfSampleMeans.toFixed(2)}) is virtually identical to the true college population mean (μ = {activeResult.populationMean.toFixed(2)}). This illustrates that the sample mean is an unbiased estimator.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h5 className="font-bold text-slate-900 text-sm mb-1">Standard Error Governs Spread</h5>
                  <p className="text-xs text-slate-600">
                    The spread of this distribution is measured by the Standard Error (SE = {activeResult.theoreticalSE.toFixed(2)}). An individual sample will fall within ±1 SE of the true mean approximately 68% of the time, and within ±2 SE approximately 95% of the time.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* COMPARISON MODE (n=30 vs n=200) */}
      {compareMode && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Split className="w-5 h-5 text-purple-700" />
              <h3 className="text-lg font-bold text-purple-900">
                Sample Size Comparison: Small Sample (n=30) vs. Large Sample (n=200)
              </h3>
            </div>
            <p className="text-sm text-purple-800">
              Notice how increasing the sample size by a factor of ~6.7 drops the Standard Error by more than half, producing a much narrower, sharper distribution around the true population mean.
            </p>
          </div>

          {comparisonResults ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Panel 1: Small Sample (n=30) */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Condition A</span>
                    <h4 className="text-base font-bold text-slate-900">Small Sample (n = 30)</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Theoretical SE</span>
                    <span className="text-lg font-bold text-rose-600 font-mono">
                      SE = {comparisonResults.small.theoreticalSE.toFixed(2)}
                    </span>
                  </div>
                </div>
                <SamplingDistributionChart result={comparisonResults.small} />
              </div>

              {/* Panel 2: Large Sample (n=200) */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Condition B</span>
                    <h4 className="text-base font-bold text-slate-900">Large Sample (n = 200)</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Theoretical SE</span>
                    <span className="text-lg font-bold text-emerald-600 font-mono">
                      SE = {comparisonResults.large.theoreticalSE.toFixed(2)}
                    </span>
                  </div>
                </div>
                <SamplingDistributionChart result={comparisonResults.large} />
              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <button
                onClick={handleRunComparison}
                className="px-6 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                Click to Run n=30 vs n=200 Comparison Now
              </button>
            </div>
          )}

          {comparisonResults && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-2">Key Comparison Insight</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                When sample size increases from <strong className="text-slate-900">n = 30</strong> to <strong className="text-slate-900">n = 200</strong>, the Standard Error shrinks from <strong className="text-rose-600">{comparisonResults.small.theoreticalSE.toFixed(2)}</strong> down to <strong className="text-emerald-600">{comparisonResults.large.theoreticalSE.toFixed(2)}</strong> (a reduction of {(((comparisonResults.small.theoreticalSE - comparisonResults.large.theoreticalSE) / comparisonResults.small.theoreticalSE) * 100).toFixed(0)}%). This demonstrates why researchers desire larger sample sizes whenever resources allow: larger samples reduce sampling error and yield much tighter confidence intervals.
              </p>
            </div>
          )}

        </div>
      )}

      {/* WHAT DID WE LEARN? */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">
            {educationalTakeaways.title}
          </h3>
        </div>
        <ul className="space-y-3">
          {educationalTakeaways.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
