import { Department, Student, VariableKey, VariableMeta, Year } from '../types';

export const VARIABLES: Record<VariableKey, VariableMeta> = {
  examMarks: {
    key: 'examMarks',
    label: 'Exam Marks',
    shortLabel: 'Marks',
    unit: 'marks',
    min: 35,
    max: 100,
    decimalPlaces: 1,
    description: 'Final semester examination marks scored out of 100'
  },
  attendance: {
    key: 'attendance',
    label: 'Attendance',
    shortLabel: 'Attendance',
    unit: '%',
    min: 50,
    max: 100,
    decimalPlaces: 1,
    description: 'Overall class attendance percentage across the academic term'
  },
  studyHours: {
    key: 'studyHours',
    label: 'Study Hours per Day',
    shortLabel: 'Study Hours',
    unit: 'hours/day',
    min: 1,
    max: 10,
    decimalPlaces: 2,
    description: 'Average daily dedicated self-study and assignment hours'
  },
  sleepHours: {
    key: 'sleepHours',
    label: 'Sleep Hours',
    shortLabel: 'Sleep',
    unit: 'hours/day',
    min: 4,
    max: 9,
    decimalPlaces: 2,
    description: 'Average daily sleep duration on weeknights'
  },
  commuteTime: {
    key: 'commuteTime',
    label: 'Commute Time',
    shortLabel: 'Commute',
    unit: 'min',
    min: 5,
    max: 120,
    decimalPlaces: 1,
    description: 'One-way daily travel duration between residence and campus'
  }
};

/**
 * Standard Normal Random Variable via Box-Muller transform
 */
function randomNormal(mean: number, stdDev: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

/**
 * Clamp a number to [min, max]
 */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Generate simulated student population
 */
export function generateStudentPopulation(size: number = 1000): Student[] {
  const departments: Department[] = ['CSE', 'ECE', 'EEE', 'MECH'];
  // Realistic department weights
  const deptProbabilities = [0.35, 0.25, 0.20, 0.20]; // CSE is largest, MECH/EEE smaller
  
  const students: Student[] = [];

  for (let i = 0; i < size; i++) {
    // Determine Department
    const randDept = Math.random();
    let cumulative = 0;
    let dept: Department = 'CSE';
    for (let d = 0; d < departments.length; d++) {
      cumulative += deptProbabilities[d];
      if (randDept <= cumulative) {
        dept = departments[d];
        break;
      }
    }

    // Determine Year (1, 2, 3, 4 with balanced distribution)
    const year = (Math.floor(Math.random() * 4) + 1) as Year;

    // Daily Study Hours (realistic normal: mean 4.2h, sd 1.4h)
    const rawStudy = randomNormal(4.2, 1.4);
    const studyHours = Number(clamp(rawStudy, 1.0, 10.0).toFixed(1));

    // Attendance (correlated slightly with study hours: mean ~81%)
    const attendanceBase = 72 + studyHours * 2.2 + randomNormal(0, 7.5);
    const attendance = Number(clamp(attendanceBase, 50, 100).toFixed(1));

    // Exam Marks (moderately correlated with study hours and attendance)
    // base 45 + studyHours*4.8 + attendance*0.2 + noise
    const marksBase = 32 + (studyHours * 4.6) + (attendance * 0.25) + randomNormal(0, 6.2);
    const examMarks = Number(clamp(marksBase, 35, 100).toFixed(1));

    // Sleep Hours (slightly negatively correlated with excessive study)
    const sleepBase = 7.4 - (studyHours * 0.15) + randomNormal(0, 0.85);
    const sleepHours = Number(clamp(sleepBase, 4.0, 9.0).toFixed(1));

    // Commute Time (skewed distribution: log-normal or right-skewed normal)
    const commuteRaw = Math.exp(randomNormal(3.4, 0.55)); // exp(3.4) ~ 30 mins
    const commuteTime = Number(clamp(commuteRaw, 5, 120).toFixed(0));

    students.push({
      id: `STU-${1000 + i + 1}`,
      department: dept,
      year,
      attendance,
      studyHours,
      examMarks,
      sleepHours,
      commuteTime
    });
  }

  return students;
}

/**
 * Simple Random Sampling (SRS) without replacement
 */
export function sampleSimpleRandom(population: Student[], sampleSize: number): Student[] {
  const n = Math.min(sampleSize, population.length);
  const copy = [...population];
  const sample: Student[] = [];

  // Fisher-Yates partial shuffle
  for (let i = 0; i < n; i++) {
    const randomIndex = i + Math.floor(Math.random() * (copy.length - i));
    const temp = copy[i];
    copy[i] = copy[randomIndex];
    copy[randomIndex] = temp;
    sample.push(copy[i]);
  }

  return sample;
}

/**
 * Stratified Sampling proportionally by Department
 */
export function sampleStratified(
  population: Student[],
  sampleSize: number
): {
  sample: Student[];
  breakdown: {
    department: Department;
    populationCount: number;
    sampleCount: number;
    ratio: number;
  }[];
} {
  const n = Math.min(sampleSize, population.length);
  const departments: Department[] = ['CSE', 'ECE', 'EEE', 'MECH'];
  
  // Group by department
  const grouped: Record<Department, Student[]> = {
    CSE: [],
    ECE: [],
    EEE: [],
    MECH: []
  };

  population.forEach((s) => {
    grouped[s.department].push(s);
  });

  // Calculate proportional sample sizes per department
  const N = population.length;
  let allocatedTotal = 0;
  const targetCounts: Record<Department, number> = {
    CSE: 0,
    ECE: 0,
    EEE: 0,
    MECH: 0
  };

  departments.forEach((dept) => {
    const popDeptCount = grouped[dept].length;
    const exact = (popDeptCount / N) * n;
    const rounded = Math.floor(exact);
    targetCounts[dept] = rounded;
    allocatedTotal += rounded;
  });

  // Distribute remaining slots to departments with highest fraction
  const remainders = departments.map((dept) => {
    const popDeptCount = grouped[dept].length;
    const exact = (popDeptCount / N) * n;
    return {
      dept,
      fraction: exact - Math.floor(exact)
    };
  }).sort((a, b) => b.fraction - a.fraction);

  let remainingSlots = n - allocatedTotal;
  for (let i = 0; i < remainingSlots; i++) {
    const d = remainders[i % remainders.length].dept;
    targetCounts[d] += 1;
  }

  // Sample within each department without replacement
  const finalSample: Student[] = [];
  const breakdown: {
    department: Department;
    populationCount: number;
    sampleCount: number;
    ratio: number;
  }[] = [];

  departments.forEach((dept) => {
    const deptStudents = grouped[dept];
    const deptSampleSize = targetCounts[dept];
    const deptSample = sampleSimpleRandom(deptStudents, deptSampleSize);
    finalSample.push(...deptSample);

    breakdown.push({
      department: dept,
      populationCount: deptStudents.length,
      sampleCount: deptSampleSize,
      ratio: deptStudents.length > 0 ? (deptSampleSize / deptStudents.length) : 0
    });
  });

  // Shuffle combined sample so departments are mixed naturally
  for (let i = finalSample.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalSample[i], finalSample[j]] = [finalSample[j], finalSample[i]];
  }

  return { sample: finalSample, breakdown };
}
