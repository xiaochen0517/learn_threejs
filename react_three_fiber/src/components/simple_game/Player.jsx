import {Icosahedron, useKeyboardControls} from "@react-three/drei";
import {RigidBody} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {useEffect, useRef} from "react";

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

  useFrame((state, delta) => {
    if (!playBodyRef.current) {
      return;
    }
    const {forward, backward, left, right, jump} = getKeys();
    // rotate the player's body
    const impulse = {x: 0, y: 0, z: 0};
    const torque = {x: 0, y: 0, z: 0};

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

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
    playBodyRef.current.applyImpulse(impulse);
    playBodyRef.current.applyTorqueImpulse(torque);
  });
  return <RigidBody
    ref={playBodyRef}
    colliders="ball"
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
