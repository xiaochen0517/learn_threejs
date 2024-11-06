import {Environment, OrbitControls, Plane} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {EffectComposer, Vignette} from "@react-three/postprocessing";
import {BlendFunction} from "postprocessing";
import RealismEffect from "../components/post_processing/RealismEffect.jsx";
import {GltfJsxDuckModel} from "../components/load_model/GltfJsxDuckModel.jsx";

export default function PostProcessingView() {

  const three = useThree();

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const defaultSceneItemsDebugData = {
    cubeControl: folder({
        cubePosition: {
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
          value: false,
          label: "Cube Visible",
        },
      },
      {
        collapsed: true,
      },
    ),
    sphereControl: folder({
        spherePosition: {
          value: {x: -1.5, y: 0, z: 0},
          label: "Position",
          x: {min: -10, max: 10},
          y: {min: -10, max: 10},
          z: {min: -10, max: 10},
        },
        sphereColor: {
          value: "#ffff00ff",
          label: "Sphere Color",
        },
        sphereVisible: {
          value: false,
          label: "Sphere Visible",
        },
      },
      {
        collapsed: true,
      },
    ),
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

  return (
    <>
      <Perf position="top-left"/>

      {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

      <ambientLight intensity={1.0}/>
      <directionalLight castShadow={true} position={[10, 10, 10]} intensity={10.0}/>

      <Environment preset="city" background blur={0.5}/>

      <mesh
        position={[debugData.cubePosition.x, debugData.cubePosition.y, debugData.cubePosition.z]}
        visible={debugData.cubeVisible}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]}/>
        <meshStandardMaterial color={debugData.cubeColor} roughness={1.0}/>
      </mesh>
      <mesh
        position={[debugData.spherePosition.x, debugData.spherePosition.y, debugData.spherePosition.z]}
        visible={debugData.sphereVisible}
      >
        <sphereGeometry args={[1]}/>
        <meshStandardMaterial color={debugData.sphereColor} roughness={0.0}/>
      </mesh>

      <GltfJsxDuckModel/>

      <Plane
        visible={debugData.planeVisible}
        args={[10, 10]}
        rotation-x={-Math.PI / 2}
        position-y={-1}
        receiveShadow={true}
      >
        <meshStandardMaterial color="white" roughness={0.1}/>
      </Plane>

      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={0.7} blendFunction={BlendFunction.NORMAL}/>
        {/*<SSR/>*/}
        <RealismEffect/>
      </EffectComposer>
    </>
  );
}
