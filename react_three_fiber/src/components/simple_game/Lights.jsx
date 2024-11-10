import {useRef} from "react";
import {useHelper} from "@react-three/drei";
import * as THREE from "three";

export default function Lights() {

  const directionalLightCameraRef = useRef();
  useHelper(directionalLightCameraRef, THREE.CameraHelper);
  return <>
    <ambientLight intensity={1.0}/>
    <directionalLight
      castShadow={true}
      position={[2, 5, 2]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    >
      <orthographicCamera ref={directionalLightCameraRef} attach="shadow-camera" args={[-10, 100, 100, -10]} far={50}/>
    </directionalLight>
  </>;
}
