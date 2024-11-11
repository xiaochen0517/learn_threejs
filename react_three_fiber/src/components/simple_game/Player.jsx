import {Icosahedron, useKeyboardControls} from "@react-three/drei";
import {RigidBody} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {useEffect, useRef} from "react";

const IMPULSE_SCALE = 0.4;
const TORQUE_SCALE = 0.1;

export default function Player() {

  const playBodyRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const doJump = () => {
    if (playBodyRef.current) {
      playBodyRef.current.applyImpulse({x: 0, y: 1, z: 0});
    }
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
  const doMove = (delta) => {
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
  useFrame((state, delta) => {
    doMove(delta);
  });
  return <RigidBody
    ref={playBodyRef}
    colliders="trimesh"
    restitution={0.2}
    friction={1}
    position={[0, 1, 0]}
    linearDamping={0.5}
  >
    <Icosahedron castShadow args={[0.3, 1]}>
      <meshStandardMaterial flatShading={true} color="mediumpurple"/>
    </Icosahedron>
  </RigidBody>;
}
