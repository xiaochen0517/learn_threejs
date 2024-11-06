import {Center, OrbitControls, Plane, Text3D, useMatcapTexture} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {useRef, useState} from "react";

export default function Text3DView() {

  const three = useThree();

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const defaultSceneItemsDebugData = {
    planeVisible: {
      value: false,
      label: "Show Plane",
    },
    disableOrbitControls: {
      value: false,
      label: "Disable Orbit Controls",
    },
  };

  const debugData = useControls({
    defaultSceneData: folder(defaultSceneItemsDebugData, {collapsed: false}),
  });

  const [matcapTexture] = useMatcapTexture("C7C0AC_2E181B_543B30_6B6270", 256);

  const [torusGeometry, setTorusGeometry] = useState(null);
  const [torusMaterial, setTorusMaterial] = useState(null);

  const donutGroup = useRef();

  useFrame((state, delta) => {
    donutGroup.current.children.forEach((donut) => {
      donut.rotation.y += delta * 0.2;
    });
  });

  return <>
    <Perf position="top-left"/>

    {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

    <ambientLight intensity={1.0}/>
    <directionalLight position={[10, 10, 10]}/>

    <Center>
      <Text3D
        font="/fonts/harmonyos_sans_black_regular.json"
        fontSize={0.75}
        position={[0, 0, 0]}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.03}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        Hello World!
        <meshMatcapMaterial matcap={matcapTexture}/>
      </Text3D>
    </Center>

    <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]}/>
    <meshMatcapMaterial ref={setTorusMaterial} matcap={matcapTexture}/>

    <group ref={donutGroup}>
      {[...Array(100)].map((_, index) => (
        <mesh
          key={index}
          geometry={torusGeometry}
          material={torusMaterial}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.15 + Math.random() * 0.2}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0,
          ]}
        />
      ))}
    </group>

    <Plane
      visible={debugData.planeVisible}
      args={[10, 10]}
      rotation-x={-Math.PI / 2}
      position-y={-1}
      material-color="skyblue"
    />
  </>;
}
