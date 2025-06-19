import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {RigidBody} from "@react-three/rapier";
import * as THREE from "three";


// Planet.jsx - 确保正确传递刚体引用
export function Planet({position, velocity, mass, radius, color, name, onPositionUpdate, onRigidBodyRef}) {
  const rigidBodyRef = useRef(null);
  const meshRef = useRef(null);

  // 设置初始速度和注册引用
  useEffect(() => {
    if (rigidBodyRef.current) {
      // 设置初始线性速度
      rigidBodyRef.current.setLinvel({
        x: velocity[0],
        y: velocity[1],
        z: velocity[2],
      }, true);

      // 设置质量
      rigidBodyRef.current.setAdditionalMass(mass - rigidBodyRef.current.mass(), true);

      // 注册刚体引用到父组件
      if (onRigidBodyRef) {
        console.log(`注册星球刚体引用: ${name}`);
        onRigidBodyRef(rigidBodyRef, name);
      }
    }
  }, [velocity, mass, onRigidBodyRef, name]);

  // 更新位置信息
  useFrame(() => {
    if (rigidBodyRef.current && onPositionUpdate) {
      const currentPos = rigidBodyRef.current.translation();
      onPositionUpdate(name, new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      type="dynamic"
      colliders="ball"
      mass={mass}
      restitution={0.8}
      friction={0.1}
      gravityScale={0} // 关闭默认重力，使用自定义引力
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]}/>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* 星球光晕效果 */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[radius, 16, 16]}/>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </RigidBody>
  );
}
