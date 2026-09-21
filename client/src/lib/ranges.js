export const RANGES = [
  { value: '2w', label: 'Last 2 weeks', short: '2 weeks' },
  { value: '1m', label: 'Last month', short: 'month' },
  { value: '3m', label: 'Last 3 months', short: '3 months' },
  { value: '1y', label: 'Last year', short: 'year' },
  { value: 'all', label: 'All time', short: 'all time' },
];

export const DEFAULT_RANGE = '2w';

export const isRange = (value) => RANGES.some((range) => range.value === value);

export const rangeShort = (value) =>
  RANGES.find((range) => range.value === value)?.short ?? '';
