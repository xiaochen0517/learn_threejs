import {OrbitControls, Plane} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {Suspense} from "react";
import DuckModel from "../components/load_model/DuckModel.jsx";

export default function LoadModelView() {

  const three = useThree();

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const defaultSceneItemsDebugData = {
    planeVisible: {
      value: true,
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

  return <>
    <Perf position="top-left" style={{marginTop: "3rem"}}/>

    {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

    <ambientLight intensity={1.0}/>
    <directionalLight position={[10, 10, 10]}/>

    <Suspense
      fallback={
        <mesh position={[0, 1, 0]}>
          <boxGeometry/>
          <meshStandardMaterial color="red"/>
        </mesh>
      }
    >
      <DuckModel/>
    </Suspense>

    <Plane
      visible={debugData.planeVisible}
      args={[10, 10]}
      rotation-x={-Math.PI / 2}
      material-color="skyblue"
    />
  </>;
}
