import {OrbitControls, Plane} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useControls} from "leva";

export default function DebugView() {

  const three = useThree();

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const {position, cubeColor, cubeVisible} = useControls({
    // position: {x: 1.5, y: 0, z: 0},
    position: {
      value: {x: 1.5, y: 0, z: 0},
      label: "Position",
      x: {min: -10, max: 10},
      y: {min: -10, max: 10},
      z: {min: -10, max: 10},
    },
    cubeColor: {
      value: "#ff0000ff",
      label: "Cube Color",
    },
    cubeVisible: {
      value: true,
      label: "Cube Visible",
    },
  });

  return <>
    <OrbitControls makeDefault/>

    <ambientLight className="" intensity={1.0}/>
    <directionalLight position={[10, 10, 10]}/>

    <mesh position={[position.x, position.y, position.z]} visible={cubeVisible}>
      <boxGeometry args={[1.5, 1.5, 1.5]}/>
      <meshStandardMaterial color={cubeColor}/>
    </mesh>
    <mesh position-x={-1.5}>
      <sphereGeometry args={[1]}/>
      <meshStandardMaterial color="yellow"/>
    </mesh>

    <Plane args={[10, 10]} rotation-x={-Math.PI / 2} position-y={-1} material-color="skyblue"/>
  </>;
}
