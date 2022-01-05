import { pearsonCorrelation, spearmanCorrelation } from "./correlationMatrix";
import { ICorrelationTypeOption } from "./shared";

export const NUMERICAL_COLUMNS = [
  "Price",
  "Living_space",
  "Lot",
  "Usable_area",
  "Rooms",
  "Bedrooms",
  "Bathrooms",
  "Floors",
  "Year_built",
  "Year_renovated",
  "Energy_consumption",
  "Garages",
];

export const CATEGORICAL_COLUMNS = [
  "Type",
  "Furnishing_quality",
  "Condition",
  "Heating",
  "State",
  "City",
  "Garagetype",
];

export const CORRELATION_TYPE_OPTIONS: Array<ICorrelationTypeOption> = [
  { value: "pearson", label: "Pearson", func: pearsonCorrelation },
  { value: "spearman", label: "Spearman", func: spearmanCorrelation },
  //   { value: "kendall", label: "Kendall Tau", func: kendallCorrelation },
];

export enum EProjection {
  PERSPECTIVE = "perspective",
  ORTHOGRAPHIC = "orthographic",
}

export const DESC_ACTIVE_COLOR = 0x006600;
export const DESC_LINE_COLOR_LIGHT = 0x999999;
export const DESC_LINE_COLOR_DARK = 0x101010;
export const LABELS_DIST = 1.0;
export const INACTIVE_CELL_SIZE = 0.2;
