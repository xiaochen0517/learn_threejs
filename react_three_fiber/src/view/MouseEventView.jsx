import {OrbitControls, Plane} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {useRef} from "react";

export default function MouseEventView() {

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

  const cubeRef = useRef();
  const sphereRef = useRef();

  const cubeClick = (event) => {
    event.stopPropagation();
    cubeRef.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };
  const sphereClick = (event) => {
    event.stopPropagation();
    sphereRef.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  const cubeHover = (event) => {
    event.stopPropagation();
    cubeRef.current.scale.set(1.5, 1.5, 1.5);
  };
  const cubeUnhover = (event) => {
    event.stopPropagation();
    cubeRef.current.scale.set(1, 1, 1);
  };
  const sphereHover = (event) => {
    event.stopPropagation();
    sphereRef.current.scale.set(1.5, 1.5, 1.5);
  };
  const sphereUnhover = (event) => {
    event.stopPropagation();
    sphereRef.current.scale.set(1, 1, 1);
  };

  return <>
    <Perf position="top-left" style={{marginTop: "3rem"}}/>

    {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

    <ambientLight intensity={1.0}/>
    <directionalLight position={[10, 10, 10]}/>

    <mesh
      ref={cubeRef}
      position={[debugData.cubePosition.x, debugData.cubePosition.y, debugData.cubePosition.z]}
      visible={debugData.cubeVisible}
      onClick={cubeClick}
      onPointerOver={cubeHover}
      onPointerOut={cubeUnhover}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]}/>
      <meshStandardMaterial color={debugData.cubeColor}/>
    </mesh>
    <mesh
      ref={sphereRef}
      position={[debugData.spherePosition.x, debugData.spherePosition.y, debugData.spherePosition.z]}
      visible={debugData.sphereVisible}
      onClick={sphereClick}
      onPointerOver={sphereHover}
      onPointerOut={sphereUnhover}
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
  </>;
}
