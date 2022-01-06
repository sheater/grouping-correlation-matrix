import * as THREE from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";

import { MultilevelCorrelationMatrix } from "./correlationMatrix";
import {
  DESC_LINE_COLOR_DARK,
  DESC_LINE_COLOR_LIGHT,
  LABELS_DIST,
} from "./consts";

interface IDynamicDescriptionMeshes {
  anchor: THREE.Object3D;
  levelDescriptions: Array<THREE.Object3D>;
}

export function createDynamicCorrelationDescription(
  matrix: MultilevelCorrelationMatrix,
  font: Font
): IDynamicDescriptionMeshes {
  const levelDescriptions = [];
  const anchor = new THREE.Object3D();
  const material = new THREE.LineBasicMaterial({ color: 0x999999 });

  for (let z = 0; z < matrix.levelsCount; z++) {
    const levelGroup = new THREE.Object3D();
    const linePoints = [];

    linePoints.push(new THREE.Vector3(0, z + 1, -LABELS_DIST * 5));
    linePoints.push(new THREE.Vector3(0, z + 1, matrix.numericalColsCount));

    const shapes = font.generateShapes(
      `${matrix.submatrices[z].name} (${matrix.submatrices[z].itemsCount})`,
      0.5
    );
    const textGeometry = new THREE.ShapeGeometry(shapes);
    const matZLabels = new THREE.LineBasicMaterial({
      color: DESC_LINE_COLOR_LIGHT,
      side: THREE.DoubleSide,
    });

    textGeometry.rotateY(Math.PI / 2);
    const text = new THREE.Mesh(textGeometry, matZLabels);
    text.position.y = z + 0.3;
    text.position.z = -LABELS_DIST;

    levelGroup.add(text);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.LineSegments(lineGeometry, material);

    levelGroup.add(line);

    anchor.add(levelGroup);
    levelDescriptions.push(levelGroup);
  }

  return { anchor, levelDescriptions };
}

export function createStaticCorrelationDescription(
  matrix: MultilevelCorrelationMatrix,
  font: Font
): THREE.Object3D {
  const linePoints = [];
  const anchor = new THREE.Object3D();

  const matDark = new THREE.LineBasicMaterial({
    color: DESC_LINE_COLOR_DARK,
    side: THREE.DoubleSide,
  });

  matrix.numericalCols.forEach((columnName, x) => {
    const shapes = font.generateShapes(columnName, 0.5);
    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.rotateX(-Math.PI / 2);
    geometry.rotateY(Math.PI / 2);

    const text = new THREE.Mesh(geometry, matDark);
    text.position.z = -LABELS_DIST;
    text.position.x = x + 0.7;
    anchor.add(text);

    linePoints.push(new THREE.Vector3(x, 0, -LABELS_DIST * 5));
    linePoints.push(new THREE.Vector3(x, 0, matrix.numericalColsCount));
  });

  linePoints.push(
    new THREE.Vector3(matrix.numericalColsCount, 0, -LABELS_DIST * 5)
  );
  linePoints.push(
    new THREE.Vector3(matrix.numericalColsCount, 0, matrix.numericalColsCount)
  );

  matrix.numericalCols.forEach((columnName, y) => {
    const shapes = font.generateShapes(columnName, 0.5);
    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();

    // @ts-ignore
    const xMid = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

    geometry.rotateX(-Math.PI / 2);
    geometry.rotateY(Math.PI);
    const text = new THREE.Mesh(geometry, matDark);
    text.position.z = y + 0.2;
    text.position.x = matrix.numericalColsCount + xMid + LABELS_DIST;
    anchor.add(text);

    linePoints.push(new THREE.Vector3(0, 0, y));
    linePoints.push(
      new THREE.Vector3(matrix.numericalColsCount + LABELS_DIST * 5, 0, y)
    );
  });

  linePoints.push(new THREE.Vector3(0, 0, matrix.numericalColsCount));
  linePoints.push(
    new THREE.Vector3(
      matrix.numericalColsCount + LABELS_DIST * 5,
      0,
      matrix.numericalColsCount
    )
  );

  const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
  const material = new THREE.LineBasicMaterial({ color: DESC_LINE_COLOR_DARK });
  const line = new THREE.LineSegments(geometry, material);

  anchor.add(line);

  const sideSize = matrix.numericalColsCount + 20;

  const geometry2 = new THREE.PlaneGeometry(sideSize, sideSize);
  const material2 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    opacity: 0.7,
    transparent: true,
  });
  geometry2.rotateX(Math.PI / 2);

  const plane = new THREE.Mesh(geometry2, material2);
  plane.position.y = -0.01;
  plane.position.x = matrix.numericalColsCount / 2;
  plane.position.z = matrix.numericalColsCount / 2;
  anchor.add(plane);

  return anchor;
}
