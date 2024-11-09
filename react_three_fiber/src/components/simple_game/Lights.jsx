import {useRef} from "react";
import {SoftShadows, useHelper} from "@react-three/drei";
import * as THREE from "three";

export default function Lights() {

  const directionalLightCameraRef = useRef();
  useHelper(directionalLightCameraRef, THREE.CameraHelper);
  return <>
    <ambientLight intensity={1.0}/>
    <directionalLight castShadow={true} position={[2, 5, 2]} shadowMapSize={[1024, 1024]}>
      <orthographicCamera ref={directionalLightCameraRef} attach="shadow-camera" args={[-10, 10, 10, -10]} far={15}/>
    </directionalLight>
  </>;
}
