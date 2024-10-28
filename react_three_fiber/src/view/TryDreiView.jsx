import {
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  Plane,
  Text,
  TransformControls,
} from "@react-three/drei";
import {useRef} from "react";
import {useThree} from "@react-three/fiber";

export default function TryDreiView() {

  const three = useThree();

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const cubeRef = useRef();
  const sphereRef = useRef();

  return <>
    <OrbitControls makeDefault/>

    <ambientLight className="" intensity={1.0}/>
    <directionalLight position={[10, 10, 10]}/>

    <mesh ref={cubeRef} position-x={2}>
      <boxGeometry/>
      <meshStandardMaterial color="red"/>
    </mesh>
    <TransformControls object={cubeRef}/>

    <PivotControls anchor={[0, 0, 0]} depthTest={false}>
      <mesh ref={sphereRef} position-x={-2}>
        <sphereGeometry/>
        <meshStandardMaterial/>
        <Html position={[1.5, 0.85, 0]} center distanceFactor={8} occlude={[cubeRef, sphereRef]}>
          <div className="px-2 text-nowrap rounded-full bg-neutral-700 bg-opacity-70 text-neutral-50">
            This is a sphere😊
          </div>
        </Html>
      </mesh>
    </PivotControls>

    <Float speed={3}>
      <Text
        font="/fonts/HarmonyOS_Sans_SC_Black.ttf"
        fontSize={1}
        position={[0, 3, 0]}
        color="black"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        Hello, Drei!
      </Text>
      <Text
        font="/fonts/HarmonyOS_Sans_SC_Black.ttf"
        fontSize={0.75}
        position={[0, 2, 0]}
        color="black"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        你好，Drei！
      </Text>
    </Float>

    <Plane args={[10, 10]} rotation-x={-Math.PI / 2} position-y={-1}>
      <MeshReflectorMaterial color="skyblue" resolution={512} mirror={0.5}/>
    </Plane>
  </>;
}
