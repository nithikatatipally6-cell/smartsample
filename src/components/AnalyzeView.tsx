import React, { useState, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  Calculator, 
  BookOpen, 
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  Student, 
  VariableKey, 
  SamplingMethod, 
  ConfidenceLevel, 
  SampleAnalysisResult 
} from '../types';
import { VARIABLES, sampleSimpleRandom, sampleStratified } from '../utils/populationGenerator';
import { 
  calculateMean, 
  calculateStdDev, 
  calculateStandardError, 
  calculateTCritical, 
  calculateConfidenceInterval 
} from '../utils/statistics';
import { 
  getAnalysisObjective, 
  getSamplingMethodLabel, 
  generateInterpretation, 
  generateConclusion, 
  getEducationalTakeaway, 
  REAL_WORLD_APPLICATIONS 
} from '../utils/formatters';
import { MeanComparisonChart } from './MeanComparisonChart';

interface AnalyzeViewProps {
  students: Student[];
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({ students }) => {
  // Input states
  const [selectedVariable, setSelectedVariable] = useState<VariableKey>('examMarks');
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [samplingMethod, setSamplingMethod] = useState<SamplingMethod>('stratified');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState<SampleAnalysisResult | null>(() => {
    // Initial sample calculation on load
    return performSampleAnalysis(students, 'examMarks', 50, 'stratified', 95);
  });

  const [showSampleData, setShowSampleData] = useState(false);

  // Core statistical analysis function
  function performSampleAnalysis(
    pop: Student[],
    variable: VariableKey,
    n: number,
    method: SamplingMethod,
    conf: ConfidenceLevel
  ): SampleAnalysisResult {
    const meta = VARIABLES[variable];
    
    // Extract population numbers
    const popValues = pop.map((s) => s[variable]);
    const popMean = calculateMean(popValues);
    const popStdDev = calculateStdDev(popValues, false);

    // Draw Sample
    let sampledStudents: Student[] = [];
    let strataBreakdown: SampleAnalysisResult['strataBreakdown'] = undefined;

    if (method === 'srs') {
      sampledStudents = sampleSimpleRandom(pop, n);
    } else {
      const stratifiedResult = sampleStratified(pop, n);
      sampledStudents = stratifiedResult.sample;
      strataBreakdown = stratifiedResult.breakdown;
    }

    const sampleValues = sampledStudents.map((s) => s[variable]);
    const sumX = sampleValues.reduce((acc, v) => acc + v, 0);
    const sampleMean = calculateMean(sampleValues);
    
    const sumSqDiff = sampleValues.reduce((acc, v) => acc + Math.pow(v - sampleMean, 2), 0);
    const sampleStdDev = calculateStdDev(sampleValues, true);
    
    const standardError = calculateStandardError(sampleStdDev, sampledStudents.length);
    const degreesOfFreedom = sampledStudents.length - 1;
    const tCritical = calculateTCritical(conf, degreesOfFreedom);
    
    const { lower, upper, marginOfError } = calculateConfidenceInterval(
      sampleMean,
      tCritical,
      standardError
    );

    const capturesPopulationMean = popMean >= lower && popMean <= upper;

    return {
      variable,
      variableMeta: meta,
      populationSize: pop.length,
      sampleSize: sampledStudents.length,
      samplingMethod: method,
      confidenceLevel: conf,
      populationMean: popMean,
      populationStdDev: popStdDev,
      sampleMean,
      sampleStdDev,
      standardError,
      degreesOfFreedom,
      tCritical,
      marginOfError,
      confidenceInterval: [lower, upper],
      capturesPopulationMean,
      sumX,
      sumSqDiff,
      sampledStudents,
      strataBreakdown
    };
  }

  const handleTakeSample = () => {
    const result = performSampleAnalysis(
      students,
      selectedVariable,
      sampleSize,
      samplingMethod,
      confidenceLevel
    );
    setAnalysisResult(result);
  };

  const handleReset = () => {
    setSelectedVariable('examMarks');
    setSampleSize(50);
    setSamplingMethod('srs');
    setConfidenceLevel(95);
    const result = performSampleAnalysis(students, 'examMarks', 50, 'srs', 95);
    setAnalysisResult(result);
  };

  const currentMeta = VARIABLES[selectedVariable];
  const educationalTakeaways = useMemo(() => getEducationalTakeaway('singleSample'), []);

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze a Student Population
        </h1>
        <p className="text-base text-slate-600 mt-1">
          Select your research parameter, configure your sampling strategy, and estimate college population metrics in real time.
        </p>
      </div>

      {/* Control Panel Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Sampling Control Panel</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* INPUT 1: What do you want to analyze? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              1. What do you want to analyze?
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

          {/* INPUT 2: Sample Size */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              2. Sample Size (n)
            </label>
            <select
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            >
              <option value={30}>30 students (Small sample, df = 29)</option>
              <option value={50}>50 students (Standard sample, df = 49)</option>
              <option value={100}>100 students (Moderate sample, df = 99)</option>
              <option value={200}>200 students (Large sample, df = 199)</option>
              <option value={300}>300 students (Very large sample, df = 299)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Represents {((sampleSize / students.length) * 100).toFixed(1)}% of college population
            </p>
          </div>

          {/* INPUT 3: Sampling Method */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              3. Sampling Method
            </label>
            <select
              value={samplingMethod}
              onChange={(e) => setSamplingMethod(e.target.value as SamplingMethod)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            >
              <option value="srs">Simple Random Sampling</option>
              <option value="stratified">Stratified Sampling (by Dept)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              {samplingMethod === 'srs'
                ? 'Equal probability for every student'
                : 'Balanced representation across departments'}
            </p>
          </div>

          {/* INPUT 4: Confidence Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              4. Confidence Level (1 - α)
            </label>
            <select
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(Number(e.target.value) as ConfidenceLevel)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            >
              <option value={90}>90% Confidence (α = 0.10)</option>
              <option value={95}>95% Confidence (α = 0.05, Standard)</option>
              <option value={99}>99% Confidence (α = 0.01, High Rigor)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Probability the interval captures true μ
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTakeSample}
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Take Sample</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Selected: <span className="font-semibold text-slate-800">{currentMeta.label}</span> · n ={' '}
            <span className="font-semibold text-slate-800">{sampleSize}</span> ·{' '}
            <span className="font-semibold text-slate-800">{getSamplingMethodLabel(samplingMethod)}</span>
          </div>
        </div>

        {/* Sampling Logic Visual Workflow */}
        <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sampling Mechanism: {getSamplingMethodLabel(samplingMethod)}</span>
          </div>

          {samplingMethod === 'srs' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Entire College Population (N = {students.length})</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">2</span>
                <span>Random Draw (Each student has equal 1/N chance)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
              <div className="flex items-center gap-2 font-semibold text-indigo-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">3</span>
                <span>Final Unbiased Sample (n = {sampleSize})</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Population (N = {students.length})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Stratified by Department (CSE, ECE, EEE, MECH)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Proportional Sample from Each Dept</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2 font-semibold text-indigo-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Combined Sample (n = {sampleSize})</span>
                </div>
              </div>

              {/* Department breakdown pills */}
              {analysisResult?.strataBreakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {analysisResult.strataBreakdown.map((stratum) => (
                    <div key={stratum.department} className="bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">{stratum.department}:</span>
                      <span className="text-slate-600">
                        <strong className="text-indigo-600">{stratum.sampleCount}</strong> students ({((stratum.sampleCount / sampleSize) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* RESULTS DASHBOARD */}
      {analysisResult && (
        <div className="space-y-8">
          
          {/* Heading */}
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Analysis Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic statistical estimation derived from current population and sample draw
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg self-start sm:self-auto">
              t-Distribution Critical: t(α/2, {analysisResult.degreesOfFreedom}) = {analysisResult.tCritical.toFixed(3)}
            </span>
          </div>

          {/* OBJECTIVE */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Objective
            </span>
            <p className="text-base font-semibold text-slate-800">
              {getAnalysisObjective(analysisResult.variable)}
            </p>
          </div>

          {/* YOUR SELECTION */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Your Selection
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Population:</span>
                <span className="font-bold text-slate-900">{analysisResult.populationSize.toLocaleString()} students</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sample Size:</span>
                <span className="font-bold text-slate-900">{analysisResult.sampleSize} students</span>
              </div>
              <div>
                <span className="text-slate-500 block">Variable:</span>
                <span className="font-bold text-slate-900">{analysisResult.variableMeta.label}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sampling Method:</span>
                <span className="font-bold text-slate-900">{getSamplingMethodLabel(analysisResult.samplingMethod)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Confidence Level:</span>
                <span className="font-bold text-slate-900">{analysisResult.confidenceLevel}%</span>
              </div>
            </div>
          </div>

          {/* FOUR RESULT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Population Mean */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Population Mean (μ)
              </span>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {analysisResult.populationMean.toFixed(analysisResult.variableMeta.decimalPlaces)}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  {analysisResult.variableMeta.unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                True average of all {analysisResult.populationSize.toLocaleString()} college students
              </p>
            </div>

            {/* Card 2: Sample Mean */}
            <div className="bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 p-5 shadow-xs">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Sample Mean (x̄)
              </span>
              <div className="text-3xl font-extrabold text-indigo-600 tabular-nums">
                {analysisResult.sampleMean.toFixed(analysisResult.variableMeta.decimalPlaces)}
                <span className="text-sm font-normal text-indigo-500 ml-1">
                  {analysisResult.variableMeta.unit}
                </span>
              </div>
              <p className="text-xs text-indigo-700/80 mt-2">
                Unbiased point estimate calculated from {analysisResult.sampleSize} sampled students
              </p>
            </div>

            {/* Card 3: Standard Error */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Standard Error (SE)
              </span>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {analysisResult.standardError.toFixed(2)}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  {analysisResult.variableMeta.unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                SE = s / √n (Estimation standard deviation)
              </p>
            </div>

            {/* Card 4: Confidence Interval */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {analysisResult.confidenceLevel}% Confidence Interval
              </span>
              <div className="text-2xl font-extrabold text-purple-700 tabular-nums mt-1">
                {analysisResult.confidenceInterval[0].toFixed(2)} – {analysisResult.confidenceInterval[1].toFixed(2)}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {analysisResult.capturesPopulationMean ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Captures true mean (μ)
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    Outside interval (1-{analysisResult.confidenceLevel}% α error)
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* FORMULA & LOGIC SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">How was this calculated?</h3>
                <p className="text-xs text-slate-500">
                  Step-by-step mathematical substitution using your dynamic sample values
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1: Sample Mean */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                  1. Sample Mean
                </span>
                <div className="font-mono text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  x̄ = Σx / n
                </div>
                <div className="font-mono text-xs text-indigo-700 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 leading-relaxed">
                  x̄ = {analysisResult.sumX.toFixed(1)} / {analysisResult.sampleSize}<br />
                  <strong>x̄ = {analysisResult.sampleMean.toFixed(analysisResult.variableMeta.decimalPlaces)} {analysisResult.variableMeta.unit}</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Sum of values divided by sample size.
                </p>
              </div>

              {/* Step 2: Standard Error */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                  2. Standard Error
                </span>
                <div className="font-mono text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  SE = s / √n
                </div>
                <div className="font-mono text-xs text-indigo-700 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 leading-relaxed">
                  s = {analysisResult.sampleStdDev.toFixed(2)}<br />
                  SE = {analysisResult.sampleStdDev.toFixed(2)} / √{analysisResult.sampleSize}<br />
                  <strong>SE = {analysisResult.standardError.toFixed(2)}</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Sample standard deviation divided by square root of n.
                </p>
              </div>

              {/* Step 3: Confidence Interval */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                  3. Confidence Interval
                </span>
                <div className="font-mono text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  CI = x̄ ± t(α/2, df) × (s / √n)
                </div>
                <div className="font-mono text-xs text-purple-700 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100 leading-relaxed">
                  df = {analysisResult.sampleSize} - 1 = {analysisResult.degreesOfFreedom}<br />
                  CI = {analysisResult.sampleMean.toFixed(2)} ± {analysisResult.tCritical.toFixed(3)}({analysisResult.standardError.toFixed(2)})<br />
                  <strong>CI = [{analysisResult.confidenceInterval[0].toFixed(2)}, {analysisResult.confidenceInterval[1].toFixed(2)}]</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Margin of error is ±{analysisResult.marginOfError.toFixed(2)} {analysisResult.variableMeta.unit}.
                </p>
              </div>

            </div>

            {/* Why t-distribution box */}
            <div className="mt-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Why t-distribution?
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Because the population standard deviation (σ) is unknown in real research scenarios, we must estimate it using the sample standard deviation (s). The Student’s t-distribution has heavier tails that properly adjust for this added estimation uncertainty, especially when sample sizes are small or moderate.
                </p>
              </div>
            </div>
          </div>

          {/* GRAPH 1: Population Mean vs Sample Mean */}
          <MeanComparisonChart result={analysisResult} />

          {/* INTERPRETATION SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Statistical Analysis
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Interpretation</h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {generateInterpretation(analysisResult)}
            </p>
          </div>

          {/* CONCLUSION SECTION */}
          <div className="bg-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-2">
              Research Takeaway
            </span>
            <h3 className="text-xl font-bold mb-3">Conclusion</h3>
            <p className="text-base sm:text-lg text-indigo-100 leading-relaxed font-medium">
              {generateConclusion(analysisResult)}
            </p>
          </div>

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

          {/* REAL-WORLD USE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Where can this be useful?</h3>
                <p className="text-xs text-slate-500">
                  Sampling and estimation methodologies are applied across academia and modern industries
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REAL_WORLD_APPLICATIONS.map((app, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{app.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{app.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SAMPLED STUDENTS DATA INSPECTOR (ACCORDION) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <button
              onClick={() => setShowSampleData(!showSampleData)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
            >
              <div>
                <span className="text-sm font-bold text-slate-900">
                  Inspect Raw Sampled Students ({analysisResult.sampledStudents.length} Students)
                </span>
                <p className="text-xs text-slate-500">
                  Verify the exact individual records drawn in this sample run
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                <span>{showSampleData ? 'Hide Sample Records' : 'View Sample Records'}</span>
                {showSampleData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showSampleData && (
              <div className="p-6 border-t border-slate-200 max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                      <th className="py-2 px-3">Student ID</th>
                      <th className="py-2 px-3">Department</th>
                      <th className="py-2 px-3">Year</th>
                      <th className="py-2 px-3 text-right">Attendance</th>
                      <th className="py-2 px-3 text-right">Study Hours</th>
                      <th className="py-2 px-3 text-right font-bold text-indigo-700">Exam Marks</th>
                      <th className="py-2 px-3 text-right">Sleep</th>
                      <th className="py-2 px-3 text-right">Commute</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analysisResult.sampledStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-medium text-indigo-600">{s.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-700">{s.department}</td>
                        <td className="py-2 px-3 text-slate-600">Year {s.year}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{s.attendance}%</td>
                        <td className="py-2 px-3 text-right tabular-nums">{s.studyHours}h</td>
                        <td className="py-2 px-3 text-right tabular-nums font-bold text-indigo-700">{s.examMarks}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{s.sleepHours}h</td>
                        <td className="py-2 px-3 text-right tabular-nums">{s.commuteTime}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
