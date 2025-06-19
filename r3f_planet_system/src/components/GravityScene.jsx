import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import {OrbitControls} from "@react-three/drei";
import {PlanetSystem} from "./PlanetSystem.jsx";

export function GravityScene() {
  return (
    <Canvas camera={{position: [0, 0, 50], fov: 60}}>
      <color attach="background" args={["#000011"]}/>

      {/* 环境光照 */}
      <ambientLight intensity={0.2}/>
      <pointLight position={[10, 10, 10]} intensity={1}/>

      {/* 星空背景 */}
      {/*<Stars*/}
      {/*  radius={300}*/}
      {/*  depth={60}*/}
      {/*  count={20000}*/}
      {/*  factor={7}*/}
      {/*  saturation={0}*/}
      {/*/>*/}

      {/* 坐标轴 */}
      <axesHelper args={[10]}/>

      {/* 物理世界 */}
      <Physics
        gravity={[0, 0, 0]}
        timeStep={1 / 120} // 提高时间步精度
        numSolverIterations={8} // 增加求解器迭代次数
        numAdditionalFrictionIterations={4}
      >
        <PlanetSystem/>
      </Physics>

      {/* 相机控制 */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={500}
      />
    </Canvas>
  );
}
