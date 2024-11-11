import {useRef} from "react";
import {useHelper} from "@react-three/drei";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";

export default function Lights() {

  const directionalLightCameraRef = useRef();
  useHelper(directionalLightCameraRef, THREE.CameraHelper);
  const directionalLightRef = useRef();

  useFrame((state) => {
    directionalLightRef.current.position.z = state.camera.position.z - 2;
    directionalLightRef.current.target.position.z = state.camera.position.z - 2;
    directionalLightRef.current.target.updateMatrixWorld();
  });
  return <>
    <ambientLight intensity={1.0}/>
    <directionalLight
      ref={directionalLightRef}
      castShadow={true}
      position={[2, 5, 2]}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    >
      <orthographicCamera ref={directionalLightCameraRef} attach="shadow-camera" args={[-10, 10, 10, -10]} far={20}/>
    </directionalLight>
  </>;
}
