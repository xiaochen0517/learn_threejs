import {OrbitControls, Plane} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {EffectComposer, SSR, Vignette} from "@react-three/postprocessing";
import {BlendFunction} from "postprocessing";

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
          value: true,
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
          value: true,
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
    <EffectComposer>
      <Vignette eskil={false} offset={0.1} darkness={0.7} blendFunction={BlendFunction.NORMAL}/>
      <SSR/>
      <Perf position="top-left" style={{marginTop: "3rem"}}/>

      {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

      <ambientLight intensity={1.0}/>
      <directionalLight position={[10, 10, 10]}/>

      <mesh
        position={[debugData.cubePosition.x, debugData.cubePosition.y, debugData.cubePosition.z]}
        visible={debugData.cubeVisible}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]}/>
        <meshStandardMaterial color={debugData.cubeColor}/>
      </mesh>
      <mesh
        position={[debugData.spherePosition.x, debugData.spherePosition.y, debugData.spherePosition.z]}
        visible={debugData.sphereVisible}
      >
        <sphereGeometry args={[1]}/>
        <meshStandardMaterial color={debugData.sphereColor}/>
      </mesh>

      <Plane
        visible={debugData.planeVisible}
        args={[10, 10]}
        rotation-x={-Math.PI / 2}
        position-y={-1}
        material-color="skyblue"
      />
    </EffectComposer>
  );
}
