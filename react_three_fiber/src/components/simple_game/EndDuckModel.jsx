/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React from "react";
import {PerspectiveCamera, useGLTF} from "@react-three/drei";
import {RigidBody} from "@react-three/rapier";

export function EndDuckModel(props) {
  const {nodes, materials} = useGLTF("/models/duck_draco/Duck.gltf");
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <RigidBody restitution={0.2} friction={0}>
          <mesh
            castShadow={true}
            receiveShadow={true}
            geometry={nodes.LOD3spShape.geometry}
            material={materials["blinn3-fx"]}
          />
        </RigidBody>
        <PerspectiveCamera
          makeDefault={false}
          far={10000}
          near={1}
          fov={37.849}
          position={[400.113, 463.264, -431.078]}
          rotation={[-2.314, 0.566, 2.614]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/duck_draco/Duck.gltf");
