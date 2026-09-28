import { ConfidenceLevel, SampleAnalysisResult, VariableKey } from '../types';
import { VARIABLES } from './populationGenerator';

/**
 * Objective sentence based on variable
 */
export function getAnalysisObjective(variable: VariableKey): string {
  switch (variable) {
    case 'examMarks':
      return 'Estimate the average exam marks of the college student population using a sample.';
    case 'attendance':
      return 'Estimate the average attendance of the college student population using a sample.';
    case 'studyHours':
      return 'Estimate the average daily study hours of the college student population using a sample.';
    case 'sleepHours':
      return 'Estimate the average sleep duration of the college student population using a sample.';
    case 'commuteTime':
      return 'Estimate the average commute time of the college student population using a sample.';
    default:
      return 'Estimate the population parameter using a representative sample.';
  }
}

/**
 * Readable sampling method name
 */
export function getSamplingMethodLabel(method: string): string {
  if (method === 'srs') return 'Simple Random Sampling';
  if (method === 'stratified') return 'Stratified Sampling';
  return method;
}

/**
 * Format variable value with its unit
 */
export function formatValueWithUnit(val: number, variable: VariableKey, decimalOverride?: number): string {
  const meta = VARIABLES[variable];
  const decimals = decimalOverride !== undefined ? decimalOverride : meta.decimalPlaces;
  const numStr = val.toFixed(decimals);
  if (meta.unit === '%') {
    return `${numStr}%`;
  }
  return `${numStr} ${meta.unit}`;
}

/**
 * Dynamic plain-English Interpretation
 */
export function generateInterpretation(result: SampleAnalysisResult): string {
  const meta = result.variableMeta;
  const sampleMeanFormatted = formatValueWithUnit(result.sampleMean, result.variable);
  const popMeanFormatted = formatValueWithUnit(result.populationMean, result.variable);
  const diff = Math.abs(result.sampleMean - result.populationMean);
  const diffFormatted = diff.toFixed(meta.decimalPlaces);
  const unit = meta.unit === '%' ? 'percentage points' : meta.unit;

  const closeness = diff <= result.standardError
    ? 'very close to'
    : diff <= result.marginOfError
    ? 'close to'
    : 'within the expected sampling variation of';

  return `The selected sample has an average ${meta.shortLabel.toLowerCase()} of ${sampleMeanFormatted}, compared with the known population average of ${popMeanFormatted} (a difference of only ${diffFormatted} ${unit}). The sample mean acts as an unbiased point estimate and is ${closeness} the true population parameter. Furthermore, with a standard error of ${result.standardError.toFixed(2)}, the sample provides an accurate estimate of the broader college student body without requiring every student to be surveyed.`;
}

/**
 * Dynamic plain-English Conclusion
 */
export function generateConclusion(result: SampleAnalysisResult): string {
  const meta = result.variableMeta;
  const sampleMeanStr = result.sampleMean.toFixed(meta.decimalPlaces);
  const lowerStr = result.confidenceInterval[0].toFixed(2);
  const upperStr = result.confidenceInterval[1].toFixed(2);
  const unitStr = meta.unit === '%' ? '%' : ` ${meta.unit}`;

  if (meta.unit === '%') {
    return `Based on the selected sample, the estimated average ${meta.shortLabel.toLowerCase()} is ${sampleMeanStr}%. At the ${result.confidenceLevel}% confidence level, the population mean is estimated to lie between ${lowerStr}% and ${upperStr}%.`;
  }

  return `Based on the selected sample, the estimated average ${meta.shortLabel.toLowerCase()} is ${sampleMeanStr}${unitStr}. At the ${result.confidenceLevel}% confidence level, the population mean is estimated to lie between ${lowerStr} and ${upperStr}${unitStr}.`;
}

/**
 * "What did we learn?" educational takeaway
 */
export function getEducationalTakeaway(type: 'singleSample' | 'samplingExperiment'): {
  title: string;
  points: string[];
} {
  if (type === 'singleSample') {
    return {
      title: 'What Did We Learn?',
      points: [
        'Sampling enables researchers to estimate large population characteristics accurately using a smaller, cost-effective subgroup.',
        'The Sample Mean (x̄) functions as a single Point Estimate of the unknown Population Mean (μ).',
        'Standard Error (SE) quantifies sample-to-sample variability; it decreases predictably as the sample size (n) increases.',
        'Because the population standard deviation is unknown in practice, we rely on Student’s t-distribution to account for added estimation uncertainty.',
        'A Confidence Interval provides a range of plausible values for the true population parameter rather than relying solely on a single number.'
      ]
    };
  }

  return {
    title: 'What Did We Learn From Repeated Sampling?',
    points: [
      'Repeated sampling produces a Sampling Distribution of sample means. Each individual point represents the mean of one independent sample.',
      'According to the Central Limit Theorem (CLT), as sample size increases, the distribution of sample means approaches an approximately normal bell curve, even if the underlying data has skew.',
      'The mean of the sample means closely converges to the true population mean: E(X̄) = μ.',
      'Larger sample sizes (e.g., n = 200 vs. n = 30) produce a significantly narrower distribution with lower standard error, making individual estimates substantially more reliable.'
    ]
  };
}

/**
 * "Where can this be useful?" real-world context
 */
export const REAL_WORLD_APPLICATIONS = [
  {
    title: 'College & University Surveys',
    description: 'Evaluating campus dining satisfaction, library resource usage, or mental health support needs across thousands of enrolled students.'
  },
  {
    title: 'Educational Research & Policy',
    description: 'Assessing the pedagogical efficacy of new curriculum structures, peer tutoring programs, or online lecture models.'
  },
  {
    title: 'Attendance & Retention Studies',
    description: 'Investigating warning indicators for student dropouts and absentee patterns by stratifying across academic departments.'
  },
  {
    title: 'Public Opinion & Market Research',
    description: 'Polling voter sentiment, consumer buying intentions, or public health guidelines adherence from representative demographic cross-sections.'
  }
];
