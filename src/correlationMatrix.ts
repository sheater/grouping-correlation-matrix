import { sumArray } from "./utils";

export type TCorrelationFunc = (xs: Array<number>, ys: Array<number>) => number;

export const pearsonCorrelation: TCorrelationFunc = (
  xs: Array<number>,
  ys: Array<number>
): number => {
  const xMean = sumArray(xs) / xs.length;
  const yMean = sumArray(ys) / ys.length;

  const xVar =
    xs.reduce((acc, x) => acc + Math.pow(x - xMean, 2), 0) / xs.length;
  const yVar =
    ys.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0) / ys.length;
  const xStd = Math.sqrt(xVar);
  const yStd = Math.sqrt(yVar);

  if (xStd > 0.0 && yStd > 0.0) {
    let s = 0.0;

    for (let i = 0; i < xs.length; i++) {
      s += (xs[i] - xMean) * (ys[i] - yMean);
    }

    const cov = s / xs.length;

    return cov / (xStd * yStd);
  } else {
    return 0.0;
  }
};

export const spearmanCorrelation: TCorrelationFunc = (
  xs: Array<number>,
  ys: Array<number>
): number => {
  if (xs.length <= 1) {
    return 0;
  }

  const xRanked = xs.map((x, i) => [i, x]).sort((a, b) => a[1] - b[1]);
  const yRanked = ys.map((y, i) => [i, y]).sort((a, b) => a[1] - b[1]);

  let dSqCum = 0.0;

  for (let i = 0; i < xs.length; i++) {
    dSqCum += (xRanked[i][0] - yRanked[i][0]) ** 2;
  }

  return 1.0 - (6 * dSqCum) / (xs.length * (xs.length ** 2 - 1));
};

export const kendallCorrelation: TCorrelationFunc = (
  xs: Array<number>,
  ys: Array<number>
): number => {
  const xRanked = xs.map((x, i) => [i, x]).sort((a, b) => a[1] - b[1]);
  const yRanked = ys.map((y, i) => [i, y]).sort((a, b) => a[1] - b[1]);

  let nConcordant = 0;
  let nDiscordant = 0;

  for (let j = 0; j < xs.length; j++) {
    for (let i = 0; i < j; i++) {
      if (xRanked[i] > xRanked[j] && yRanked[i] > yRanked[j]) {
        nConcordant++;
      } else if (xRanked[i] < xRanked[j] && yRanked[i] < yRanked[j]) {
        nDiscordant++;
      }
    }
  }

  return (nConcordant - nDiscordant) / ((xs.length * (xs.length - 1)) / 2);
};

export class CorrelationSubmatrix {
  public readonly values: Array<Array<number | null>>;
  public readonly itemsCount: number;

  constructor(
    public readonly name: string,
    public readonly columns: Array<string>,
    items: Array<any>,
    correlationFunc: TCorrelationFunc
  ) {
    this.itemsCount = items.length;
    this.values = columns.map((y_key, y_idx) => {
      return columns.map((x_key, x_idx) => {
        if (x_idx >= y_idx) {
          return null;
        }

        const itemsFilt = items.filter(
          (record) =>
            record.hasOwnProperty(x_key) && record.hasOwnProperty(y_key)
        );

        if (!itemsFilt.length) {
          return 0;
        }

        const xs = itemsFilt.map((item) => item[x_key]);
        const ys = itemsFilt.map((item) => item[y_key]);

        return correlationFunc(xs, ys);
      });
    });
  }

  get dimensionsCount(): number {
    return this.columns.length;
  }
}

export class MultilevelCorrelationMatrix {
  public readonly submatrices: Array<CorrelationSubmatrix> = [];

  get levelsCount(): number {
    return this.submatrices.length;
  }

  get numericalColsCount(): number {
    return this.numericalCols.length;
  }

  constructor(
    data: Array<Record<string, any>>,
    categoricalVar: string,
    public readonly numericalCols: Array<string>,
    correlationFunc: TCorrelationFunc
  ) {
    const groups: Record<string, any> = {};

    for (const entry of data) {
      const value = entry[categoricalVar];

      if (value == null) {
        continue;
      }

      if (value in groups) {
        groups[value].push(entry);
      } else {
        groups[value] = [entry];
      }
    }

    for (const [name, items] of Object.entries(groups)) {
      this.submatrices.push(
        new CorrelationSubmatrix(name, numericalCols, items, correlationFunc)
      );
    }
  }
}
