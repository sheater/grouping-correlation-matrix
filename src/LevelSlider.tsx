import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { getRGBStringFromCorrelationCoef } from "./utils";
import { IVisActions, IVisControlState } from "./shared";
import { MultilevelCorrelationMatrix } from "./correlationMatrix";

interface IProps {
  actions: IVisActions;
  matrix: MultilevelCorrelationMatrix;
  controlState: IVisControlState;
}

const LevelSlider: React.FunctionComponent<IProps> = ({
  actions,
  matrix,
  controlState,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: any) => {
      switch (e.key) {
        case "ArrowUp":
          actions.setControlState((s) => ({
            ...s,
            currentLevel:
              s.currentLevel >= matrix.levelsCount - 1 ? 0 : s.currentLevel + 1,
          }));
          break;

        case "ArrowDown":
          actions.setControlState((s) => ({
            ...s,
            currentLevel:
              s.currentLevel <= 0 ? matrix.levelsCount - 1 : s.currentLevel - 1,
          }));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix]);

  const { correlationThreshold } = controlState;

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const dy = canvas.height / matrix.levelsCount;

    matrix.submatrices.forEach((sub, yi) => {
      let currX = 0;

      for (let xi = 0; xi < matrix.numericalColsCount; xi++) {
        for (let zi = 0; zi < matrix.numericalColsCount; zi++) {
          if (xi <= zi) {
            continue;
          }
          //   const sub = matrix.submatrices[yi];
          const value = sub.values[xi][zi];

          currX++;

          if (value == null || (value > -correlationThreshold && value < correlationThreshold)) {
            continue;
          }

          context.globalAlpha = value ** 2;
          context.fillStyle = getRGBStringFromCorrelationCoef(value);
          context.fillRect(
            2 * currX,
            dy * (matrix.levelsCount - 1) - yi * dy,
            2,
            dy
          );
          context.globalAlpha = 1.0;
        }
      }
    });
  }, [matrix, correlationThreshold]);

  return (
    <div style={{ height: "100%", display: "block", position: "relative" }}>
      <Slider
        vertical
        // reverse
        min={0}
        max={matrix.levelsCount}
        value={controlState.currentLevel}
        onChange={(currentLevel) =>
          actions.changeControlState({ currentLevel })
        }
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: "40px",
          top: "0px",
          width:
            (matrix.numericalColsCount * (matrix.numericalColsCount - 1)),
          height: "100%",
        }}
      />
    </div>
  );
};

export default LevelSlider;
