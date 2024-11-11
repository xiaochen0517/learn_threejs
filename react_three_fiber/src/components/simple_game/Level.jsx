import * as THREE from "three";
import {CuboidCollider, RigidBody} from "@react-three/rapier";
import {useEffect, useRef, useState} from "react";
import {folder, useControls} from "leva";
import {useFrame} from "@react-three/fiber";
import {EndDuckModel} from "./EndDuckModel.jsx";
import Player from "./Player.jsx";

const FLOOR_WIDTH = 4;
const FLOOR_HEIGHT = 0.2;

const FLOOR_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);

const FLOOR_1_MATERIAL = new THREE.MeshStandardMaterial({color: "limegreen"});
const FLOOR_2_MATERIAL = new THREE.MeshStandardMaterial({color: "greenyellow"});
const OBSTACLE_MATERIAL = new THREE.MeshStandardMaterial({color: "orangered"});
const WALL_MATERIAL = new THREE.MeshStandardMaterial({color: "slategray"});
const TRANSPARENT_MATERIAL = new THREE.MeshBasicMaterial({color: "transparent", opacity: 0.0, transparent: true});

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

function BlockEnd({position = [0, 0, 0]}) {
  return <group position={position}>
    <Floor material={FLOOR_1_MATERIAL}/>
    <EndDuckModel/>
  </group>;
}

function Bounds({length = 1}) {
  return <>
    <RigidBody type="fixed">
      <mesh
        castShadow={true}
        geometry={FLOOR_GEOMETRY}
        material={WALL_MATERIAL}
        scale={[FLOOR_HEIGHT, FLOOR_WIDTH, FLOOR_WIDTH * length]}
        position={[FLOOR_WIDTH * 0.5 + FLOOR_HEIGHT * 0.5, FLOOR_WIDTH * 0.5, -FLOOR_WIDTH * length * 0.5 + FLOOR_WIDTH * 0.5]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <mesh
        castShadow={true}
        geometry={FLOOR_GEOMETRY}
        material={WALL_MATERIAL}
        scale={[0.2, FLOOR_WIDTH, FLOOR_WIDTH * length]}
        position={[-FLOOR_WIDTH * 0.5 - FLOOR_HEIGHT * 0.5, FLOOR_WIDTH * 0.5, -FLOOR_WIDTH * length * 0.5 + FLOOR_WIDTH * 0.5]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <mesh
        castShadow={true}
        geometry={FLOOR_GEOMETRY}
        material={TRANSPARENT_MATERIAL}
        scale={[FLOOR_WIDTH, FLOOR_WIDTH, FLOOR_HEIGHT]}
        position={[0, FLOOR_WIDTH * 0.5, FLOOR_WIDTH * 0.5 + FLOOR_HEIGHT * 0.5]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <mesh
        castShadow={true}
        geometry={FLOOR_GEOMETRY}
        material={WALL_MATERIAL}
        scale={[FLOOR_WIDTH, FLOOR_WIDTH, FLOOR_HEIGHT]}
        position={[0, FLOOR_WIDTH * 0.5, -FLOOR_WIDTH * length + FLOOR_WIDTH * 0.5 - FLOOR_HEIGHT * 0.5]}
      />
    </RigidBody>
  </>;
}

export class LevelProps {
  EASY = 1;
  MEDIUM = 2;
  HARD = 3;
  VERY_HARD = 4;
}

function getBlockCount(level) {
  switch (level) {
    case new LevelProps().MEDIUM:
      return 10;
    case new LevelProps().HARD:
      return 15;
    case new LevelProps().VERY_HARD:
      return 20;
    default:
      return 5;
  }
}

export default function Level({level = 1}) {
  const blockCount = getBlockCount(level);
  const barriers = [BlockStir, BlockSlide];
  return <>
    <BlockStart/>
    {[...Array(blockCount)].map((_, index) => {
      const randomIndex = Math.floor(Math.random() * barriers.length);
      const Block = barriers[randomIndex];
      return <Block key={index} position={[0, 0, -FLOOR_WIDTH * (index + 1)]}/>;
    })}
    <BlockEnd position={[0, 0, -FLOOR_WIDTH * (blockCount + 1)]}/>
    <Bounds length={blockCount + 2}/>
    <CuboidCollider
      args={[FLOOR_WIDTH * 0.5, FLOOR_HEIGHT * 0.5, FLOOR_WIDTH * (blockCount + 2) * 0.5]}
      position={[0, -FLOOR_HEIGHT * 0.5, -FLOOR_WIDTH * (blockCount + 1) * 0.5]}
      restitution={0.2}
      friction={1}
    />
    <Player/>
  </>;
}
