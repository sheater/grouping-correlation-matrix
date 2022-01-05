import { SetStateAction, Dispatch } from "react";

import { TCorrelationFunc } from "./correlationMatrix";

export interface ICorrelationTypeOption {
  value: string;
  label: string;
  func: TCorrelationFunc;
}

export interface ICategoryOption {
  value: string;
  label: string;
}

export type TData = Array<Record<string, string | number>>;

export interface IVisControlState {
  correlationType: ICorrelationTypeOption;
  currentCategory: ICategoryOption;
  correlationThreshold: number;
  currentLevel: number;
  visibleLevels: number;
}

export interface IVisActions {
  changeControlState: (changes: Partial<IVisControlState>) => void;
  setControlState: Dispatch<SetStateAction<IVisControlState>>;
}
