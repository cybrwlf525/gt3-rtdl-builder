export function convertToPercentages(
  frequencies: { [key: number]: { [value: number]: number } },
  validComboCount: number
): { [key: number]: { [value: number]: number } } {
  let percentages: { [key: number]: { [value: number]: number } } = {};

  for (const [key, values] of Object.entries(frequencies)) {
    const numKey = parseInt(key);
    percentages[numKey] = {};

    for (const [value, frequency] of Object.entries(values)) {
      const numValue = parseInt(value);
      percentages[numKey][numValue] = Number(
        ((frequency / validComboCount) * 100).toPrecision(4)
      );
    }
  }

  return percentages;
}
