import React from "react";
import Slider, { Range } from "rc-slider";
import Select from "react-select";

import LevelSlider from "./LevelSlider";
import {
  ICategoryOption,
  IVisControlState,
  IVisActions,
  ICorrelationTypeOption,
} from "./shared";
import { CORRELATION_TYPE_OPTIONS } from "./consts";
import { MultilevelCorrelationMatrix } from "./correlationMatrix";

interface IProps {
  matrix: MultilevelCorrelationMatrix;
  controlState: IVisControlState;
  actions: IVisActions;
  categoryOptions: Array<ICategoryOption>;
}

const Controls: React.FunctionComponent<IProps> = ({
  controlState,
  matrix,
  actions,
  categoryOptions,
}) => {
  const maxLevelsOfInterest = Math.min(10, matrix.levelsCount);

  return (
    <React.Fragment>
      <div className="controls-pane controls-left-pane">
        <div className="controls-label">Categorical variable</div>
        <Select
          value={controlState.currentCategory}
          onChange={(newValue) => {
            actions.changeControlState({
              currentLevel: 0,
              currentCategory: newValue as ICategoryOption,
            });
          }}
          options={categoryOptions}
        />

        <br />

        <div className="controls-label">Correlation coefficient</div>
        <Select
          value={controlState.correlationType}
          onChange={(newValue) => {
            console.log("newValue", newValue);
            actions.changeControlState({
              correlationType: newValue as ICorrelationTypeOption,
            });
          }}
          options={CORRELATION_TYPE_OPTIONS}
        />

        <br />

        <div className="controls-label">Correlation visibility boundaries</div>
        <Range
          min={0.0}
          max={1.0}
          step={0.05}
          marks={{ 0.0: 0, 0.5: 0.5, 1.0: 1 }}
          defaultValue={[0.5, 1.0]}
          onChange={(value) => {
            actions.changeControlState({
              correlationBounds: value as [number, number],
            });
          }}
        />

        <br />

        <div className="controls-label">Levels of interest</div>
        <Slider
          min={1}
          max={maxLevelsOfInterest}
          marks={{ "1": 1, [maxLevelsOfInterest]: maxLevelsOfInterest }}
          value={controlState.visibleLevels}
          onChange={(visibleLevels) =>
            actions.changeControlState({ visibleLevels })
          }
        />
      </div>
      <div className="controls-pane controls-right-pane">
        <LevelSlider
          actions={actions}
          matrix={matrix}
          controlState={controlState}
        />
      </div>
    </React.Fragment>
  );
};

export default Controls;
