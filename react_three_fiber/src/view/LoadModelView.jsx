import {OrbitControls, Plane, Text, useHelper} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {Suspense, useEffect, useRef} from "react";
import DuckModel from "../components/load_model/DuckModel.jsx";
import {GltfJsxDuckModel} from "../components/load_model/GltfJsxDuckModel.jsx";
import * as THREE from "three";
import {CoffeeCupModel} from "../components/load_model/CoffeeCupModel.jsx";

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

  const [debugData, set] = useControls(() => ({
    defaultSceneData: folder(defaultSceneItemsDebugData, {collapsed: false}),
    showModelType: {
      value: "default-duck",
      label: "Show Model Type",
      options: ["default-duck", "gltf-jsx-duck", "coffee-cup"],
    },
  }));

  useEffect(() => {
    if (debugData.showModelType === "coffee-cup") {
      set({
        planeVisible: false,
      });
    }
    console.log("debugData: ", debugData);
  }, [debugData.showModelType, set]);

  const directionalLightRef = useRef();
  const directionalLightCameraRef = useRef();
  useHelper(directionalLightRef, THREE.DirectionalLightHelper);
  useHelper(directionalLightCameraRef, THREE.CameraHelper);

  return <>
    <Perf position="top-left" style={{marginTop: "3rem"}}/>

    {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

    <ambientLight intensity={0.5}/>
    <directionalLight
      ref={directionalLightRef}
      castShadow={true}
      shadow-normalBias={0.06}
      position={[10, 10, 10]}
      intensity={3.0}
    >
      <orthographicCamera ref={directionalLightCameraRef} attach="shadow-camera" args={[-10, 10, 10, -10]}/>
    </directionalLight>

    <Suspense
      fallback={
        <Text font="/fonts/HarmonyOS_Sans_SC_Black.ttf" fontSize={1} position={[2, 1, 0]} color="black">
          Loading...
        </Text>
      }
    >
      {(() => {
        switch (debugData.showModelType) {
          case "default-duck":
            return <DuckModel/>;
          case "gltf-jsx-duck":
            return <GltfJsxDuckModel/>;
          case "coffee-cup":
            return <CoffeeCupModel/>;
          default:
            return <></>;
        }
      })()}
    </Suspense>

    <Plane
      receiveShadow={true}
      visible={debugData.planeVisible}
      args={[10, 10]}
      rotation-x={-Math.PI / 2}
    >
      <meshStandardMaterial attach="material" color="skyblue"/>
    </Plane>
  </>;
}
