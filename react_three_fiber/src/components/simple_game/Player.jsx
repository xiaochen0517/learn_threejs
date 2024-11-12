import {Icosahedron, useKeyboardControls} from "@react-three/drei";
import {RigidBody, useRapier} from "@react-three/rapier";
import {useFrame, useThree} from "@react-three/fiber";
import {useContext, useEffect, useState} from "react";
import * as THREE from "three";
import {PlayerContext} from "./PlayerContext.jsx";

const PLAYER_RADIUS = 0.3;
const IMPULSE_SCALE = 0.4;
const TORQUE_SCALE = 0.1;

export default function Player() {

  /**
   * Control
   */
  const playBodyRef = useContext(PlayerContext);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const {rapier, world} = useRapier();

  const doJump = () => {
    if (!playBodyRef.current) {
      return;
    }
    // Check if the player is on the ground
    const origin = playBodyRef.current.translation();
    origin.y -= PLAYER_RADIUS + 0.01;
    const rayDirection = {x: 0, y: -1, z: 0};
    const ray = new rapier.Ray(origin, rayDirection);
    const hit = world.castRay(ray, 10, true);
    if (!hit || hit.timeOfImpact > 0.15) {
      return;
    }

    if (playBodyRef.current.isSleeping()) {
      playBodyRef.current.wakeUp();
    }
    playBodyRef.current.applyImpulse({x: 0, y: 0.5, z: 0});
  };
  useEffect(() => {
    return subscribeKeys(
      (state) => state.jump,
      (jump) => {
        if (jump) {
          doJump();
        }
      },
    );
  }, []);

  const noneZero = (v) => v.x !== 0 || v.y !== 0 || v.z !== 0;
  const movePlayer = (delta) => {
    if (!playBodyRef.current) {
      return;
    }
    const {forward, backward, left, right} = getKeys();
    const impulse = {x: 0, y: 0, z: 0};
    const torque = {x: 0, y: 0, z: 0};
    const impulseStrength = IMPULSE_SCALE * delta;
    const torqueStrength = TORQUE_SCALE * delta;
    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (noneZero(impulse) || noneZero(torque)) {
      // wake up the body
      playBodyRef.current.wakeUp();
    }
    playBodyRef.current.applyImpulse(impulse);
    playBodyRef.current.applyTorqueImpulse(torque);
  };

  /**
   * Camera
   */
  const three = useThree();
  const [smoothCameraPosition] = useState(() => new THREE.Vector3());
  const [smoothCameraTargetPosition] = useState(() => new THREE.Vector3());

  const [cameraInitialized, setCameraInitialized] = useState(true);
  useEffect(() => {
    console.log("init camera");
    // init camera position
    three.camera.position.set(0, 10, 10);
    three.camera.lookAt(0, 10, 0);
    smoothCameraPosition.copy(three.camera.position.clone());
    smoothCameraTargetPosition.copy(new THREE.Vector3(0, 10, 0));
    setTimeout(() => {
      setCameraInitialized(true);
    }, 500);
  }, []);

  const moveCamera = (state, delta) => {
    if (!playBodyRef.current || !cameraInitialized) {
      return;
    }
    const playerPosition = playBodyRef.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerPosition);
    cameraPosition.z += 2.5;
    cameraPosition.y += 1;

    const cameraTargetPosition = new THREE.Vector3();
    cameraTargetPosition.copy(playerPosition);
    cameraTargetPosition.y += 0.5;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTargetPosition.lerp(cameraTargetPosition, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTargetPosition);
  };

  useFrame((state, delta) => {
    movePlayer(delta);
    moveCamera(state, delta);
  });

  return <RigidBody
    ref={playBodyRef}
    colliders="trimesh"
    restitution={0.2}
    friction={1}
    position={[0, 1, 0]}
    linearDamping={0.5}
  >
    <Icosahedron castShadow args={[PLAYER_RADIUS, 1]}>
      <meshStandardMaterial flatShading={true} color="mediumpurple"/>
    </Icosahedron>
  </RigidBody>;
}
