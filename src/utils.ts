export const sumArray = (a: Array<number>) => a.reduce((acc, x) => acc + x, 0);

export const getRGBStringFromCorrelationCoef = (coef: number) => {
  const r = Math.ceil((coef < 0 ? -coef : 0) * 100);
  const b = Math.ceil((coef > 0 ? coef : 0) * 100);

  return `rgb(${r}%, 0%, ${b}%)`;
};

export const isCorrelationCoefInBounds = (value: number, bounds: [number, number]) => {
    const absVal = Math.abs(value);

    return absVal >= bounds[0] && absVal <= bounds[1];
}
