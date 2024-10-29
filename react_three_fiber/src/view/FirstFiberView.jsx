import {DoubleSide} from "three";
import CustomMesh from "../components/first_fiber/CustomMesh.jsx";
import {extend, useFrame, useThree} from "@react-three/fiber";
import {useRef} from "react";

// use OrbitControls
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

extend({OrbitControls});

export default function FirstFiberView() {

  const three = useThree();
  // camera position settings
  three.camera.position.set(5, 5, 5);
  three.camera.lookAt(0, 0, 0);

  // three.flat = true;
  console.log(three);

  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((_state, delta) => {
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;

    // groupRef.current.rotation.y += delta;
  });

  return <>
    <orbitControls args={[three.camera, three.gl.domElement]}/>

    <ambientLight intensity={0.5}/>
    <directionalLight position={[5, 5, 5]}/>

    <group ref={groupRef}>
      <mesh ref={meshRef} position-x={3}>
        <torusKnotGeometry args={[0.7, 0.30, 128, 32]}/>
        <meshStandardMaterial color="yellow"/>
      </mesh>
      <mesh position-x={-3}>
        <boxGeometry args={[2, 2, 2]}/>
        <meshStandardMaterial color="blue"/>
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-1.5}>
        <planeGeometry args={[10, 10]}/>
        <meshStandardMaterial color="green" side={DoubleSide}/>
      </mesh>

      <CustomMesh/>
    </group>
  </>;
}
