import React from "react";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { useThree } from "@react-three/fiber";
// @ts-ignore
import { Interaction } from "three.interaction/src/index";
import * as THREE from "three";

// import { MultilevelCorrelationMatrix } from "./correlationMatrix";
import { createCorrelationMesh } from "./mesh";
import {
  createDynamicCorrelationDescription,
  createStaticCorrelationDescription,
} from "./description";
// import { useVisState, visStateContext } from "./visState";
import { DESC_ACTIVE_COLOR, DESC_LINE_COLOR_LIGHT, INACTIVE_CELL_SIZE } from "./consts";
import { IVisControlState } from "./shared";
import { MultilevelCorrelationMatrix } from "./correlationMatrix";

interface IProps {
  font: Font;
  matrix: MultilevelCorrelationMatrix;
  controlState: IVisControlState;
}

const MatrixPlot: React.FunctionComponent<IProps> = ({
  font,
  matrix,
  controlState,
}) => {
  //   const { matrix, controlState } = useVisState();
  //   console.log("statestate", state);
  //   const { matrix, controlState } = state;
  const { camera, scene, gl } = useThree();
  //   const vs = React.useContext(visStateContext);

  //   console.log("vs", vs);

  React.useEffect(() => {
    new Interaction(gl, scene, camera);
  }, [camera, scene, gl]);

  //   console.log("MatrixPlot.controlState", useVisState());
  //   console.log("MatrixPlot.controlState", controlState);
  //   console.log("MatrixPlot.matrix", matrix);

  const { anchor, levelGroups } = React.useMemo(
    () => createCorrelationMesh(matrix, controlState.correlationBounds),
    [matrix, controlState.correlationBounds]
  );

  const staticDescription = React.useMemo(
    () => createStaticCorrelationDescription(matrix, font),
    [matrix, font]
  );

  const { anchor: dynamicDescription, levelDescriptions } = React.useMemo(
    () => createDynamicCorrelationDescription(matrix, font),
    [matrix, font]
  );

  React.useEffect(() => {
    anchor.position.y = -controlState.currentLevel;
    dynamicDescription.position.y = -controlState.currentLevel;

    levelGroups.forEach((levelGroup, index) => {
      levelGroup.traverse((descendant) => {
        if (!(descendant instanceof THREE.Mesh)) {
          return;
        }

        const mesh = descendant as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.MeshBasicMaterial
        >;
        const s =
          index >= controlState.currentLevel &&
          index < controlState.currentLevel + controlState.visibleLevels
            ? 1.0
            : INACTIVE_CELL_SIZE;
        mesh.scale.set(s, s, s);
      });
    });

    levelDescriptions.forEach((levelDesc, index) => {
      levelDesc.traverse((descendant) => {
        // console.log("descendant", descendant);

        if (!(descendant instanceof THREE.Mesh)) {
          return;
        }

        const mesh = descendant as THREE.Mesh<
          THREE.ShapeGeometry,
          THREE.LineBasicMaterial
        >;

        // mesh.material.color.set(
        //   index >= level && index < level + visibleLevels
        //     ? DESC_ACTIVE_COLOR
        //     : DESC_LINE_COLOR_LIGHT
        // );
        // mesh.material.needsUpdate = true;
        mesh.material.color.set(
          index >= controlState.currentLevel &&
            index < controlState.currentLevel + controlState.visibleLevels
            ? DESC_ACTIVE_COLOR
            : DESC_LINE_COLOR_LIGHT
        );
        // mesh.material.needsUpdate = true;
      });
      //   levelGroup.visible = index >= level && index < level + visibleLevels;
    });
  }, [
    levelGroups,
    levelDescriptions,
    anchor,
    dynamicDescription,
    controlState,
  ]);

  return (
    <React.Fragment>
      <group
        position={[
          -matrix.numericalColsCount * 0.75,
          0,
          -matrix.numericalColsCount * 0.25,
        ]}
      >
        <primitive object={staticDescription} />
        <primitive object={dynamicDescription} />
        <primitive object={anchor} />
      </group>
    </React.Fragment>
  );
};

export default MatrixPlot;
