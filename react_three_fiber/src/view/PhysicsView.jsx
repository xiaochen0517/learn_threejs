import {OrbitControls, SoftShadows} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import {CuboidCollider, InstancedRigidBodies, Physics, RigidBody} from "@react-three/rapier";
import {useMemo, useRef, useState} from "react";
import * as THREE from "three";

export default function PhysicsView() {

  const [hitSound] = useState(() => new Audio("/audios/putting_a_book2.mp3"));

  const three = useThree();

  three.camera.position.set(8, 3, 8);
  three.camera.lookAt(0, 0, 0);

  const defaultSceneItemsDebugData = {
    cubeControl: folder({
        cubePosition: {
          value: {x: 1.5, y: 3, z: 0},
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
          value: {x: -1.5, y: 3, z: 0},
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
  const twisterRef = useRef();

  const cubeJump = () => {
    console.log("cube jump");
    cubeRef.current.applyImpulse({x: -20, y: 0, z: 0});
  };

  useFrame((state) => {
    if (!twisterRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();

    const eulerRotation = new THREE.Euler(0, elapsedTime, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twisterRef.current.setNextKinematicRotation(quaternionRotation);

    const moveAngle = elapsedTime;
    const moveX = Math.cos(moveAngle) * 2;
    const moveZ = Math.sin(moveAngle) * 2;
    twisterRef.current.setNextKinematicTranslation({x: moveX, y: 0, z: moveZ});
  });

  const cubeCollectionEnter = (event) => {
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random() * 0.5 + 0.5;
    // hitSound.play();
  };

  const cubeCount = 100;
  const cubesRef = useRef();

  const cubeInstancesData = () => {
    const instances = [];
    for (let i = 0; i < cubeCount; i++) {
      const position = [
        (Math.random() - 0.5) * 8,
        4 + Math.random() * 4,
        (Math.random() - 0.5) * 8,
      ];
      const rotation = [
        Math.random(),
        Math.random(),
        Math.random(),
      ];
      const scaleValue = Math.random() * 0.8 + 0.2;
      const scale = [scaleValue, scaleValue, scaleValue];
      instances.push({key: `cube-${i}`, position, rotation, scale});
    }
    return instances;
  };
  const cubesInstances = useMemo(() => {
    return cubeInstancesData();
  }, []);

  // useEffect(() => {
  //   for (let i = 0; i < cubeCount; i++) {
  //     const matrix = new THREE.Matrix4();
  //     // matrix.compose(
  //     //   new THREE.Vector3(i * 2, 2, 0),
  //     //   new THREE.Quaternion(),
  //     //   new THREE.Vector3(1, 1, 1),
  //     // );
  //     cubesRef.current.setMatrixAt(i, matrix);
  //   }
  // }, []);

  return <>
    <Perf position="top-left"/>

    {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}

    <ambientLight intensity={0.5}/>
    <directionalLight castShadow={true} position={[10, 10, 10]}/>

    <SoftShadows focus={0.1} samples={10}/>

    <Physics debug={false}>
      <RigidBody ref={cubeRef} onCollisionEnter={cubeCollectionEnter}>
        <mesh
          castShadow={true}
          position={[debugData.cubePosition.x, debugData.cubePosition.y, debugData.cubePosition.z]}
          visible={debugData.cubeVisible}
          onClick={cubeJump}
        >
          <boxGeometry args={[1.5, 1.5, 1.5]}/>
          <meshStandardMaterial color={debugData.cubeColor}/>
        </mesh>
      </RigidBody>
      <RigidBody colliders="ball">
        <mesh
          castShadow={true}
          position={[debugData.spherePosition.x, debugData.spherePosition.y, debugData.spherePosition.z]}
          visible={debugData.sphereVisible}
        >
          <sphereGeometry args={[1]}/>
          <meshStandardMaterial color={debugData.sphereColor}/>
        </mesh>
      </RigidBody>

      <RigidBody ref={twisterRef} type="kinematicPosition" friction={0}>
        <mesh caseShadow={true} position={[0, -0.8, 0]}>
          <boxGeometry args={[0.4, 0.4, 3]}/>
          <meshStandardMaterial color={"red"}/>
        </mesh>
      </RigidBody>

      <InstancedRigidBodies instances={cubesInstances}>
        <instancedMesh ref={cubesRef} castShadow={true} args={[null, null, cubeCount]}>
          <boxGeometry/>
          <meshStandardMaterial color={"tomato"}/>
        </instancedMesh>
      </InstancedRigidBodies>

      <RigidBody type="fixed" restitution={0.5}>
        <mesh receiveShadow={true} position={[0, -1, 0]}>
          <boxGeometry args={[10, 0.1, 10]}/>
          <meshStandardMaterial color={"skyblue"}/>
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <CuboidCollider args={[5, 3, 0.2]} position={[0, 2, -5.2]}/>
        <CuboidCollider args={[5, 3, 0.2]} position={[0, 2, 5.2]}/>
        <CuboidCollider args={[0.2, 3, 5]} position={[5.2, 2, 0]}/>
        <CuboidCollider args={[0.2, 3, 5]} position={[-5.2, 2, 0]}/>
      </RigidBody>
    </Physics>
  </>;
}
