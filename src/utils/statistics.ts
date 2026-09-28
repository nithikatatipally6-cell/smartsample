import { ConfidenceLevel } from '../types';

/**
 * Basic mean calculation
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

/**
 * Standard deviation: sample (N-1) or population (N)
 */
export function calculateStdDev(values: number[], isSample: boolean = true): number {
  if (values.length <= 1) return 0;
  const mean = calculateMean(values);
  const sumSqDiff = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const divisor = isSample ? values.length - 1 : values.length;
  return Math.sqrt(sumSqDiff / divisor);
}

/**
 * Standard Error of the mean: SE = s / sqrt(n)
 */
export function calculateStandardError(stdDev: number, sampleSize: number): number {
  if (sampleSize <= 0) return 0;
  return stdDev / Math.sqrt(sampleSize);
}

/**
 * Standard Normal Quantiles (z-values) for two-tailed alpha:
 * 90% confidence -> alpha = 0.10, p = 0.95 -> z = 1.644853
 * 95% confidence -> alpha = 0.05, p = 0.975 -> z = 1.959964
 * 99% confidence -> alpha = 0.01, p = 0.995 -> z = 2.575829
 */
const Z_QUANTILES: Record<ConfidenceLevel, number> = {
  90: 1.6448536269514722,
  95: 1.959963984540054,
  99: 2.5758293035489004,
};

// Precise Student's t critical values for df 1 to 30 for two-tailed tests
const EXACT_T_TABLE: Record<ConfidenceLevel, Record<number, number>> = {
  90: {
    1: 6.314, 2: 2.920, 3: 2.353, 4: 2.132, 5: 2.015,
    6: 1.943, 7: 1.895, 8: 1.860, 9: 1.833, 10: 1.812,
    11: 1.796, 12: 1.782, 13: 1.771, 14: 1.761, 15: 1.753,
    16: 1.746, 17: 1.740, 18: 1.734, 19: 1.729, 20: 1.725,
    21: 1.721, 22: 1.717, 23: 1.714, 24: 1.711, 25: 1.708,
    26: 1.706, 27: 1.703, 28: 1.701, 29: 1.699, 30: 1.697
  },
  95: {
    1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
    6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
    11: 2.201, 12: 2.179, 13: 2.160, 14: 2.145, 15: 2.131,
    16: 2.120, 17: 2.110, 18: 2.101, 19: 2.093, 20: 2.086,
    21: 2.080, 22: 2.074, 23: 2.069, 24: 2.064, 25: 2.060,
    26: 2.056, 27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042
  },
  99: {
    1: 63.657, 2: 9.925, 3: 5.841, 4: 4.604, 5: 4.032,
    6: 3.707, 7: 3.499, 8: 3.355, 9: 3.250, 10: 3.169,
    11: 3.106, 12: 3.055, 13: 3.012, 14: 2.977, 15: 2.947,
    16: 2.921, 17: 2.898, 18: 2.878, 19: 2.861, 20: 2.845,
    21: 2.831, 22: 2.819, 23: 2.807, 24: 2.797, 25: 2.787,
    26: 2.779, 27: 2.771, 28: 2.763, 29: 2.756, 30: 2.750
  }
};

/**
 * Calculate Student's t critical value t(alpha/2, df)
 * Uses exact lookup for df <= 30 and Cornish-Fisher 4-term expansion for df > 30.
 */
export function calculateTCritical(confidenceLevel: ConfidenceLevel, df: number): number {
  if (df <= 0) return 0;
  
  if (df <= 30 && EXACT_T_TABLE[confidenceLevel]?.[df]) {
    return EXACT_T_TABLE[confidenceLevel][df];
  }

  const z = Z_QUANTILES[confidenceLevel];
  const z2 = z * z;
  const z3 = z2 * z;
  const z5 = z3 * z2;
  const z7 = z5 * z2;
  
  const v = df;
  const v2 = v * v;
  const v3 = v2 * v;

  // Cornish-Fisher expansion for Student's t quantile
  const term1 = z;
  const term2 = (z3 + z) / (4 * v);
  const term3 = (5 * z5 + 16 * z3 + 3 * z) / (96 * v2);
  const term4 = (3 * z7 + 19 * z5 + 17 * z3 - 15 * z) / (384 * v3);

  const tVal = term1 + term2 + term3 + term4;
  return Number(tVal.toFixed(3));
}

/**
 * Calculate Confidence Interval: [lower, upper]
 */
export function calculateConfidenceInterval(
  sampleMean: number,
  tCritical: number,
  standardError: number
): { lower: number; upper: number; marginOfError: number } {
  const marginOfError = tCritical * standardError;
  const lower = sampleMean - marginOfError;
  const upper = sampleMean + marginOfError;
  return { lower, upper, marginOfError };
}

/**
 * Normal Distribution Probability Density Function (for CLT overlay curves)
 */
export function normalPdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return coefficient * Math.exp(exponent);
}
