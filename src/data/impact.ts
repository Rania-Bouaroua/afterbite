/** Illustrative prototype figures — NOT actual business results. */
export const impactStats = [
  { key: 'meals', label: 'Meals saved', value: 12480, suffix: '', decimals: 0, note: 'Projected first-year pilot' },
  { key: 'money', label: 'Saved by customers', value: 486000, suffix: ' MAD', decimals: 0, note: 'Illustrative estimate' },
  { key: 'partners', label: 'Partner restaurants', value: 140, suffix: '+', decimals: 0, note: 'Pilot target, 6 cities' },
  { key: 'waste', label: 'Food waste avoided', value: 15.6, suffix: ' t', decimals: 1, note: '≈ 1.25 kg per meal' },
] as const;

/** Assumptions used for the per-user impact estimate. */
export const KG_FOOD_PER_MEAL = 1.25;
export const KG_CO2_PER_MEAL = 2.5;
