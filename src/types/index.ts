export type Department = 'CSE' | 'ECE' | 'EEE' | 'MECH';
export type Year = 1 | 2 | 3 | 4;

export interface Student {
  id: string;
  department: Department;
  year: Year;
  attendance: number; // 50 - 100 (%)
  studyHours: number; // 1 - 10 (hours/day)
  examMarks: number; // 35 - 100 (marks)
  sleepHours: number; // 4 - 9 (hours/day)
  commuteTime: number; // 5 - 120 (minutes)
}

export type VariableKey = 'examMarks' | 'attendance' | 'studyHours' | 'sleepHours' | 'commuteTime';

export interface VariableMeta {
  key: VariableKey;
  label: string;
  shortLabel: string;
  unit: string;
  min: number;
  max: number;
  decimalPlaces: number;
  description: string;
}

export type SamplingMethod = 'srs' | 'stratified';
export type ConfidenceLevel = 90 | 95 | 99;

export interface SampleAnalysisResult {
  variable: VariableKey;
  variableMeta: VariableMeta;
  populationSize: number;
  sampleSize: number;
  samplingMethod: SamplingMethod;
  confidenceLevel: ConfidenceLevel;
  
  // Statistics
  populationMean: number;
  populationStdDev: number;
  sampleMean: number;
  sampleStdDev: number;
  standardError: number;
  degreesOfFreedom: number;
  tCritical: number;
  marginOfError: number;
  confidenceInterval: [number, number];
  capturesPopulationMean: boolean;
  
  // Calculation breakdown data
  sumX: number;
  sumSqDiff: number;
  
  // Sampled records
  sampledStudents: Student[];
  strataBreakdown?: {
    department: Department;
    populationCount: number;
    sampleCount: number;
    ratio: number;
  }[];
}

export interface ExperimentSample {
  sampleIndex: number;
  mean: number;
}

export interface ExperimentResult {
  variable: VariableKey;
  variableMeta: VariableMeta;
  sampleSize: number;
  numSamples: number;
  populationMean: number;
  populationStdDev: number;
  meanOfSampleMeans: number;
  empiricalStdDev: number;
  theoreticalSE: number;
  sampleMeans: number[];
  histogramBins: {
    min: number;
    max: number;
    midpoint: number;
    count: number;
    frequency: number;
  }[];
}
