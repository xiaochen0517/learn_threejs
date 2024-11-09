import * as THREE from "three";
import {RigidBody} from "@react-three/rapier";
import {useEffect, useRef, useState} from "react";
import {folder, useControls} from "leva";
import {useFrame} from "@react-three/fiber";

const FLOOR_WIDTH = 4;
const FLOOR_HEIGHT = 0.2;

const FLOOR_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);

const FLOOR_1_MATERIAL = new THREE.MeshStandardMaterial({color: "limegreen"});
const FLOOR_2_MATERIAL = new THREE.MeshStandardMaterial({color: "greenyellow"});
const OBSTACLE_MATERIAL = new THREE.MeshStandardMaterial({color: "orangered"});
const WALL_MATERIAL = new THREE.MeshStandardMaterial({color: "slategray"});

function Floor({position = [0, -FLOOR_HEIGHT * 0.5, 0], material = FLOOR_1_MATERIAL}) {
  return <mesh
    receiveShadow={true}
    geometry={FLOOR_GEOMETRY}
    material={material}
    scale={[FLOOR_WIDTH, FLOOR_HEIGHT, FLOOR_WIDTH]}
    position={position}
  />;
}

function BlockStart({position = [0, 0, 0]}) {
  return <group position={position}>
    <Floor/>
  </group>;
}

function BlockStir({position = [0, 0, 0]}) {

  const twisterRef = useRef();

  const {twisterSize} = useControls({
    blockStir: folder({
      twisterSize: {
        value: {
          x: 3,
          y: 0.4,
          z: 0.4,
        },
        label: "Twister Size",
        x: {min: 0.1, max: 10},
        y: {min: 0.1, max: 10},
        z: {min: 0.1, max: 10},
      },
    }, {collapsed: true}),
  });

  const [speed] = useState(() => (Math.random() + 0.5) * (Math.random() < 0.5 ? -1 : 1));
  const setTwisterRotation = (elapsedTime) => {
    if (!twisterRef.current) {
      return;
    }
    const eulerRotation = new THREE.Euler(0, elapsedTime * speed, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twisterRef.current.setNextKinematicRotation(quaternionRotation);
  };

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    setTwisterRotation(elapsedTime);
  });

  return <group position={position}>
    <Floor material={FLOOR_2_MATERIAL}/>

    <RigidBody ref={twisterRef} type="kinematicPosition" restitution={0.2} friction={0}>
      <mesh
        castShadow={true}
        geometry={FLOOR_GEOMETRY}
        material={OBSTACLE_MATERIAL}
        scale={[twisterSize.x, twisterSize.y, twisterSize.z]}
        position={[0, twisterSize.y * 0.5, 0]}
      >
      </mesh>
    </RigidBody>
  </group>;
}

function BlockSlide({position = [0, 0, 0]}) {

  const twisterRef = useRef();

  const {twisterSize} = useControls({
    blockSlide: folder({
      twisterSize: {
        value: {
          x: 0.4,
          y: 0.4,
          z: 3,
        },
        label: "Twister Size",
        x: {min: 0.1, max: 10},
        y: {min: 0.1, max: 10},
        z: {min: 0.1, max: 10},
      },
    }, {collapsed: true}),
  });

  const [speed] = useState(() => Math.random() + 0.5);
  const [animationType, setAnimationType] = useState("x");
  useEffect(() => {
    const random = Math.random();
    if (random < 0.33) {
      setAnimationType("x");
    } else if (random < 0.66) {
      setAnimationType("y");
    } else {
      setAnimationType("z");
    }
  }, []);

  const setTwisterPosition = (elapsedTime) => {
    if (!twisterRef.current) {
      return;
    }
    const translation = {x: position[0], y: position[1], z: position[2]};
    translation[animationType] += Math.sin(elapsedTime) * speed;
    twisterRef.current.setNextKinematicTranslation({x: Math.sin(elapsedTime), y: position[1], z: position[2]});
  };

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    setTwisterPosition(elapsedTime);
  });

  return <group position={position}>
    <Floor material={FLOOR_2_MATERIAL}/>

    <RigidBody ref={twisterRef} type="kinematicPosition" restitution={0.2} friction={0}>
      <mesh
        castShadow={true}
        geometry={FLOOR_GEOMETRY}
        material={OBSTACLE_MATERIAL}
        scale={[twisterSize.x, twisterSize.y, twisterSize.z]}
        position={[0, twisterSize.y * 0.5, 0]}
      >
      </mesh>
    </RigidBody>
  </group>;
}

export default function Level() {
  return <>
    <BlockStart/>
    <BlockStir position={[0, 0, -FLOOR_WIDTH]}/>
    <BlockSlide position={[0, 0, -FLOOR_WIDTH * 2]}/>
  </>;
}
