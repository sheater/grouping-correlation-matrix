import * as THREE from "three";

import {
  CorrelationSubmatrix,
  MultilevelCorrelationMatrix,
} from "./correlationMatrix";
import { getRGBStringFromCorrelationCoef } from "./utils";
import { INACTIVE_CELL_SIZE } from "./consts";

interface ICorrelationMeshes {
  anchor: THREE.Object3D;
  levelGroups: Array<THREE.Object3D>;
}

export function createCorrelationMesh(
  matrix: MultilevelCorrelationMatrix,
  correlationThreshold: number
): ICorrelationMeshes {
  const anchor = new THREE.Object3D();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const levelGroups: Array<THREE.Object3D> = [];

  matrix.submatrices.forEach((submatrix: CorrelationSubmatrix, z: number) => {
    const levelGroup = new THREE.Object3D();

    submatrix.values.forEach((row: any, y: number) => {
      row.forEach((cell: any, x: number) => {
        if (
          cell == null ||
          (cell > -correlationThreshold && cell < correlationThreshold)
        ) {
          return null;
        }

        const color = new THREE.Color(getRGBStringFromCorrelationCoef(cell));
        const material = new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: Math.abs(cell),
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x + 0.5, z + 0.5, y + 0.5);
        mesh.scale.set(INACTIVE_CELL_SIZE, INACTIVE_CELL_SIZE, INACTIVE_CELL_SIZE);

        // // @ts-ignore
        // mesh.on("click", (ev) => {
        //   console.log("clickclickclick", ev);
        // });

        levelGroup.add(mesh);
      });
    });

    levelGroups.push(levelGroup);
    anchor.add(levelGroup);
  });

  return { anchor, levelGroups };
}
