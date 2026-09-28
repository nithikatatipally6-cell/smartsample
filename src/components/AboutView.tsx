import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Target, 
  TrendingUp, 
  Calculator, 
  Compass, 
  Users, 
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { REAL_WORLD_APPLICATIONS } from '../utils/formatters';

export const AboutView: React.FC = () => {
  const concepts = [
    {
      number: '01',
      title: 'Sampling',
      description: 'The process of selecting a subset of individuals from within a statistical population to estimate characteristics of the whole population without examining every unit.'
    },
    {
      number: '02',
      title: 'Simple Random Sampling (SRS)',
      description: 'A sampling technique where every individual student in the college population has an equal, independent probability of being chosen, eliminating investigator bias.'
    },
    {
      number: '03',
      title: 'Stratified Sampling',
      description: 'Dividing the population into mutually exclusive subgroups (strata) based on shared characteristics (such as academic departments: CSE, ECE, EEE, MECH) and drawing proportional random samples from each.'
    },
    {
      number: '04',
      title: 'Sampling Distribution',
      description: 'The theoretical probability distribution of a given sample statistic (such as the sample mean x̄) obtained by drawing all possible samples of a fixed size n from the population.'
    },
    {
      number: '05',
      title: 'Central Limit Theorem (CLT)',
      description: 'A fundamental theorem in statistics stating that as sample size n grows large (typically n ≥ 30), the sampling distribution of the sample mean approaches a normal distribution, regardless of the underlying population shape.'
    },
    {
      number: '06',
      title: 'Point Estimation',
      description: 'Using a single computed statistic from sample data (such as the sample mean x̄) as the best single guess for an unknown population parameter (such as μ).'
    },
    {
      number: '07',
      title: 'Standard Error (SE)',
      description: 'The standard deviation of the sampling distribution of a statistic (SE = s / √n). It measures how much the sample mean is expected to vary between different samples.'
    },
    {
      number: '08',
      title: "Student's t-Distribution",
      description: 'A continuous probability distribution used instead of the standard normal z-distribution when the population standard deviation is unknown and must be estimated from sample variance (df = n - 1).'
    },
    {
      number: '09',
      title: 'Interval Estimation / Confidence Intervals',
      description: 'A range of plausible values [x̄ - t(SE), x̄ + t(SE)] calculated from sample data that is expected to contain the true population parameter with a specified confidence level (such as 95%).'
    }
  ];

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About SmartSample
        </h1>
        <p className="text-base text-slate-600 mt-1">
          College Student Analytics & Statistical Estimation Platform
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Problem */}
        <div className="bg-white rounded-2xl border border-rose-100 p-6 sm:p-7 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
            The Fundamental Problem
          </span>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Studying an Entire Population is Difficult
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            In modern higher education, colleges enroll thousands of students across different departments, batches, and programs.
            Attempting a complete census (surveying every single student) is often prohibitive due to high operational costs,
            time constraints, logistical hurdles, and non-response fatigue.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-white rounded-2xl border border-indigo-100 p-6 sm:p-7 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
            The Statistical Solution
          </span>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Representative Sampling & Estimation
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Statistical sampling allows researchers to collect data from a carefully selected representative subset of students.
            By applying probability theory, standard error calculations, and confidence intervals, we can estimate population
            characteristics with quantifiable precision without ever testing everyone.
          </p>
        </div>

      </div>

      {/* 9 Statistical Concepts Demonstrated */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Core Statistical Concepts Demonstrated
            </h2>
            <p className="text-xs text-slate-500">
              Key topics from Module VI: Sampling & Estimation implemented in SmartSample
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {concepts.map((c) => (
            <div key={c.number} className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-600 block">
                Concept {c.number}
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {c.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Use Cases */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Where Can This Be Useful?
            </h2>
            <p className="text-xs text-slate-500">
              Everyday applications of sampling and parameter estimation
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

      {/* Simulated Educational Data Notice */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Educational Simulation Transparency</span>
        </div>
        <p className="leading-relaxed">
          All student records, departments, attendance percentages, study hours, exam marks, sleep times, and commute metrics on SmartSample are generated automatically in the client browser using mathematical simulation techniques. The data does not represent actual students and is designed purely for teaching sampling methodology, the Central Limit Theorem, and confidence interval estimation.
        </p>
      </div>

    </div>
  );
};
