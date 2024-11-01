import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Sky,
  SoftShadows,
  Stage,
  useHelper,
} from "@react-three/drei";
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

  const {
    cubePosition,
    openLight,
    openStage,
    openEnvMap,
    openHdrEnvMap,
    openHdrSunset,
    openEnvMapGround,
    openLightformer,
    openBakeShadows,
    openPlane,
    shadowType,
  } = useControls({
    cubePosition: {
      value: {x: 2, y: 2, z: 0},
      label: "Cube Position",
      x: {min: -10, max: 10, step: 0.1},
      y: {min: -10, max: 10, step: 0.1},
      z: {min: -10, max: 10, step: 0.1},
    },
    openLight: {
      value: true,
      label: "Open Light",
    },
    openStage: {
      value: false,
      label: "Open Stage",
    },
    openEnvMap: {
      value: false,
      label: "Open Environment Map",
      render: (get) => !get("openStage"),
    },
    openHdrEnvMap: {
      value: false,
      label: "Open HDR Environment Map",
    },
    openHdrSunset: {
      value: false,
      label: "Open HDR Sunset",
      render: (get) => get("openHdrEnvMap"),
    },
    openEnvMapGround: {
      value: false,
      label: "Open Environment Map Ground",
      render: (get) => get("openEnvMap"),
    },
    openLightformer: {
      value: false,
      label: "Open Lightformer",
    },
    openBakeShadows: {
      value: false,
      label: "Open Bake Shadows",
    },
    openPlane: {
      value: true,
      label: "Open Plane",
    },
    shadowType: {
      value: "none",
      label: "Shadow Type",
      options: ["none", "SoftShadows", "AccumulativeShadows", "ContactShadows"],
    },
  });

  const directionalLightRef = useRef();
  const directionalLightCameraRef = useRef();
  useHelper(directionalLightRef, openLight ? THREE.DirectionalLightHelper : null);
  useHelper(directionalLightCameraRef, openLight ? THREE.CameraHelper : null);

  const cubeRef = useRef();
  useFrame((_state, delta) => {
    cubeRef.current.rotation.y += delta;
  });

  const cubeAndSphere = <>
    <mesh ref={cubeRef} castShadow={true} position={[cubePosition.x, cubePosition.y, cubePosition.z]}>
      <boxGeometry args={[1.5, 1.5, 1.5]}/>
      <meshStandardMaterial color="blue"/>
    </mesh>
    <mesh castShadow={true} position-x={-2} position-y={1}>
      <sphereGeometry args={[1]}/>
      <meshStandardMaterial color="yellow"/>
    </mesh>
  </>;

  return <>
    <Perf position="top-left" style={{marginTop: "3rem"}}/>

    <OrbitControls makeDefault/>

    {/* set background color */}
    <color args={["lightblue"]} attach="background"/>

    <axesHelper args={[5]}/>

    {!openEnvMap ? <Sky/> : <></>}

    {openBakeShadows ? <BakeShadows/> : <></>}
    {(() => {
      switch (shadowType) {
        case "SoftShadows":
          return <SoftShadows size={10}/>;
        case "AccumulativeShadows":
          return (
            <AccumulativeShadows position-y={-0.89} scale={10}>
              <RandomizedLight amount={8} position={[5, 5, 5]}/>
            </AccumulativeShadows>
          );
        case "ContactShadows":
          return <ContactShadows position={[0, -0.89, 0]}/>;
        default:
          return <></>;
      }
    })()}

    {openEnvMap ?
      <Environment
        background
        files={openHdrEnvMap && !openHdrSunset ? "/environmentMaps/je_gray_02_2k.hdr" : null}
        preset={openHdrEnvMap && openHdrSunset ? "sunset" : null}
        ground={openEnvMapGround ? {
          height: 7,
          radius: 28,
          scale: 100,
        } : null}
      >
        <color args={["lightblue"]} attach="background"/>
        {openLightformer ?
          <Lightformer color="white" scale={10} intensity={10} position={[0, 0, -5]} form="ring"/> : <></>
        }
      </Environment> : <></>
    }

    {
      openLight ? (<>
        <ambientLight intensity={0.5}/>
        <directionalLight
          ref={directionalLightRef}
          castShadow={true}
          position={[5, 5, 5]}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera ref={directionalLightCameraRef} attach="shadow-camera" args={[-10, 10, 10, -10]}/>
        </directionalLight>
      </>) : (<></>)
    }

    {openStage ? <Stage>{cubeAndSphere}</Stage> : cubeAndSphere}

    {!openStage && openPlane ? <mesh receiveShadow={true} position-y={0} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[10, 10]}/>
      <meshStandardMaterial color="skyblue"/>
    </mesh> : <></>}
  </>;
}
