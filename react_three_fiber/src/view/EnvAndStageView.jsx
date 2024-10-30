import {OrbitControls, Sky, SoftShadows, useHelper} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {useControls} from "leva";
import {Perf} from "r3f-perf";
import {useRef} from "react";
import * as THREE from "three";

export default function EnvAndStageView() {

  const three = useThree();
  // set background color
  // three.gl.setClearColor("lightblue", 1.0);

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const {cubePosition} = useControls({
    cubePosition: {
      value: {x: 2, y: 1, z: 0},
      label: "Cube Position",
      x: {min: -10, max: 10, step: 0.1},
      y: {min: -10, max: 10, step: 0.1},
      z: {min: -10, max: 10, step: 0.1},
    },
  });

  const directionalLightRef = useRef();
  useHelper(directionalLightRef, THREE.DirectionalLightHelper);
  const directionalLightCameraRef = useRef();
  useHelper(directionalLightCameraRef, THREE.CameraHelper);

  const cubeRef = useRef();
  useFrame((_state, delta) => {
    cubeRef.current.rotation.y += delta;
  });

  return <>
    <Perf position="top-left" style={{marginTop: "3rem"}}/>

    <OrbitControls makeDefault/>

    {/* set background color */}
    <color args={["lightblue"]} attach="background"/>

    <axesHelper args={[5]}/>

    <Sky/>

    {/*<BakeShadows/>*/}
    <SoftShadows size={10}/>
    {/*<AccumulativeShadows position-y={-0.89} scale={10}>*/}
    {/*  <RandomizedLight amount={8} position={[5, 5, 5]}/>*/}
    {/*</AccumulativeShadows>*/}
    {/*<ContactShadows position={[0, -0.89, 0]}/>*/}

    <ambientLight intensity={1.0}/>
    <directionalLight ref={directionalLightRef} castShadow={true} position={[5, 5, 5]} shadow-mapSize={[1024, 1024]}>
      <orthographicCamera ref={directionalLightCameraRef} attach="shadow-camera" args={[-10, 10, 10, -10]}/>
    </directionalLight>

    <mesh ref={cubeRef} castShadow={true} position={[cubePosition.x, cubePosition.y, cubePosition.z]}>
      <boxGeometry args={[1.5, 1.5, 1.5]}/>
      <meshStandardMaterial color="blue"/>
    </mesh>
    <mesh castShadow={true} position-x={-2}>
      <sphereGeometry args={[1]}/>
      <meshStandardMaterial color="yellow"/>
    </mesh>

    <mesh receiveShadow={true} position-y={-0.9} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[10, 10]}/>
      <meshStandardMaterial color="skyblue"/>
    </mesh>
  </>;
}
