import React from 'react';
import { ArrowRight, Layers, Target, Compass, BookOpen, Users, Award, TrendingUp, BarChart3 } from 'lucide-react';
import { Student } from '../types';
import { calculateMean } from '../utils/statistics';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'analyze' | 'experiment' | 'about') => void;
  students: Student[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, students }) => {
  const avgMarks = calculateMean(students.map((s) => s.examMarks)).toFixed(1);
  const avgAttendance = calculateMean(students.map((s) => s.attendance)).toFixed(1);
  const avgStudy = calculateMean(students.map((s) => s.studyHours)).toFixed(1);

  // Department counts
  const cseCount = students.filter((s) => s.department === 'CSE').length;
  const eceCount = students.filter((s) => s.department === 'ECE').length;
  const eeeCount = students.filter((s) => s.department === 'EEE').length;
  const mechCount = students.filter((s) => s.department === 'MECH').length;

  return (
    <div className="space-y-12 py-6">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-4 pb-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          SmartSample
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">
          Understand a Population Using a Sample
        </p>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          An interactive statistical platform for exploring sampling, sampling distributions,
          the Central Limit Theorem, and statistical estimation using simulated college student data.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('analyze')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('experiment')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Sampling</span>
            <Compass className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </section>

      {/* Three Simple Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Sampling */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sampling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select a representative sample from a large student population using Simple Random Sampling or Stratified Sampling.
            </p>
          </div>

          {/* Card 2: Estimation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Estimation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Estimate population parameters using sample statistics, standard error, and Student&apos;s t-distribution confidence intervals.
            </p>
          </div>

          {/* Card 3: Understand */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Understand</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visualize sampling distributions and confidence intervals to experience the Central Limit Theorem in real time.
            </p>
          </div>

        </div>
      </section>

      {/* Why Sampling Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-2xl p-6 sm:p-8 border border-indigo-100/80">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Why sampling?</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Studying every student in a large college population can be time-consuming, expensive, and logistically impractical.
                Statistical sampling allows researchers to study a smaller group and use it to estimate population characteristics
                with quantifiable mathematical confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Population Overview Snapshot */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                <span>SIMULATED COLLEGE DATASET</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Current College Population Overview ({students.length.toLocaleString()} Students)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors shrink-0"
            >
              <span>Take a Sample from this Population</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Population Size</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">N = {students.length}</span>
              <span className="text-xs text-slate-500 block mt-1">Enrolled college students</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">True Mean Exam Marks</span>
              <span className="text-2xl font-bold text-indigo-600 tabular-nums">μ = {avgMarks}</span>
              <span className="text-xs text-slate-500 block mt-1">Out of 100 max marks</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">True Mean Attendance</span>
              <span className="text-2xl font-bold text-purple-600 tabular-nums">μ = {avgAttendance}%</span>
              <span className="text-xs text-slate-500 block mt-1">Term attendance average</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">True Mean Study Hours</span>
              <span className="text-2xl font-bold text-sky-600 tabular-nums">μ = {avgStudy} h</span>
              <span className="text-xs text-slate-500 block mt-1">Daily independent study</span>
            </div>
          </div>

          {/* Department Strata breakdown */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center justify-between">
              <span>Departmental Strata Breakdown (Available for Stratified Sampling)</span>
              <span className="text-slate-500 font-normal">4 Departments</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-indigo-700 block">CSE</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{cseCount}</span>
                <span className="text-[11px] text-slate-500 block">{((cseCount / students.length) * 100).toFixed(0)}% of college</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-purple-700 block">ECE</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{eceCount}</span>
                <span className="text-[11px] text-slate-500 block">{((eceCount / students.length) * 100).toFixed(0)}% of college</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-sky-700 block">EEE</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{eeeCount}</span>
                <span className="text-[11px] text-slate-500 block">{((eeeCount / students.length) * 100).toFixed(0)}% of college</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-amber-700 block">MECH</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{mechCount}</span>
                <span className="text-[11px] text-slate-500 block">{((mechCount / students.length) * 100).toFixed(0)}% of college</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
