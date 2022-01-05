import React from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const Camera: React.FunctionComponent<{}> = () => {
  const { gl, camera } = useThree();

  const controls = React.useMemo<OrbitControls>(() => {
    camera.position.set(10, 10, -10);
    const controls = new OrbitControls(camera, gl.domElement);

    return controls;
  }, [camera, gl.domElement]);

  React.useEffect(() => {
    return () => {
      controls.dispose();
    };
  }, [controls]);

  return null;
};
