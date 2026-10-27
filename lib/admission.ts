// The Panhellenic platform's idea in miniature: probability instead of pass/fail. Synthetic cutoffs.

export const DEPARTMENT = {
  name: 'Informatics (illustrative)',
  cutoffs: [17120, 17480, 16950, 17610, 17890], // last five years, synthetic
  nationalMean: 13400,
  nationalSd: 2900,
};

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};

export function admission(score: number) {
  const { cutoffs } = DEPARTMENT;
  const m = mean(cutoffs);
  const vol = sd(cutoffs);
  // Weighted trend: recent years count more.
  const weights = cutoffs.map((_, i) => i + 1);
  const slope = cutoffs.slice(1).reduce((s, c, i) => s + (c - cutoffs[i]) * weights[i + 1], 0) / weights.slice(1).reduce((a, b) => a + b, 0);
  const expected = cutoffs[cutoffs.length - 1] + slope * 0.5;
  const k = 1.7 / vol; // steeper when cutoffs are stable
  const p = 1 / (1 + Math.exp(-k * (score - expected)));
  const z = (score - DEPARTMENT.nationalMean) / DEPARTMENT.nationalSd;
  return { p, expected, vol, slope, z, mean: m };
}
