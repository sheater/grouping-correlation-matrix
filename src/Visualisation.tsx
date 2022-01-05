import React from "react";
import { Canvas } from "@react-three/fiber";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";

import { Camera } from "./Camera";
import MatrixPlot from "./MatrixPlot";
import Controls from "./Controls";
import {
  NUMERICAL_COLUMNS,
  CATEGORICAL_COLUMNS,
  CORRELATION_TYPE_OPTIONS,
} from "./consts";
import { TData, IVisActions, IVisControlState } from "./shared";
import { MultilevelCorrelationMatrix } from "./correlationMatrix";

interface IProps {
  data: TData;
  font: Font;
}

const Visualisation: React.FunctionComponent<IProps> = ({ data, font }) => {
  const categoricalCounts = React.useMemo(() => {
    const options = CATEGORICAL_COLUMNS.map((column) => {
      const valueCount: Record<string, number> = {};

      for (const entry of data) {
        const value = entry[column];

        if (value == null) {
          continue;
        }

        if (value in valueCount) {
          valueCount[value] += 1;
        } else {
          valueCount[value] = 1;
        }
      }

      return [column, valueCount];
    });

    return Object.fromEntries(options);
  }, [data]);

  const categoryOptions = React.useMemo(() => {
    return CATEGORICAL_COLUMNS.map((x) => ({
      value: x,
      label: `${x} (${Object.keys(categoricalCounts[x]).length})`,
    }));
  }, [categoricalCounts]);

  const [controlState, setControlState] = React.useState<IVisControlState>({
    correlationType: CORRELATION_TYPE_OPTIONS[0],
    currentCategory: categoryOptions[0],
    correlationBounds: [0.5, 1.0],
    currentLevel: 0,
    visibleLevels: 1,
  });

  const matrix = React.useMemo(() => {
    return new MultilevelCorrelationMatrix(
      data,
      controlState.currentCategory.value,
      NUMERICAL_COLUMNS,
      controlState.correlationType.func
    );
  }, [data, controlState.currentCategory, controlState.correlationType]);

  const actions: IVisActions = {
    setControlState,
    changeControlState: (changes: Partial<IVisControlState>) =>
      setControlState((s) => ({ ...s, ...changes })),
  };

  return (
    <React.Fragment>
      <Canvas>
        <Camera />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <color attach="background" args={[1, 1, 1]} />

        <MatrixPlot font={font} controlState={controlState} matrix={matrix} />
      </Canvas>

      <Controls
        controlState={controlState}
        matrix={matrix}
        actions={actions}
        categoryOptions={categoryOptions}
      />
    </React.Fragment>
  );
};

export default Visualisation;
