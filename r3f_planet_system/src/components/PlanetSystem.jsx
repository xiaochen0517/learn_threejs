import {useCallback, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {useRapier} from "@react-three/rapier";
import {Planet} from "./Planet";
import {TrailRenderer} from "./TrailRenderer";

// 引力常数
const G = 6.67430e-11 * 1e10;

// 改进的轨道速度计算函数
const calculateOrbitalVelocity = (centralMass, distance, eccentricity = 0) => {
  // 基础圆形轨道速度：$v = \sqrt{\frac{GM}{r}}$
  const baseVelocity = Math.sqrt(G * centralMass / distance);

  // 添加速度修正因子，确保轨道稳定性
  const stabilityFactor = 1.1; // 增加10%的速度余量

  // 根据偏心率调整（椭圆轨道的近日点速度更高）
  const eccentricityBoost = 1 + eccentricity * 0.5;

  return baseVelocity * stabilityFactor * eccentricityBoost;
};

// 重新平衡的星球配置
const planetConfigs = [
  {
    name: "sun",
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    mass: 30000, // 适度降低太阳质量
    radius: 3,
    color: "#ffb300",
  },
  {
    name: "earth",
    position: [100, 0, 0],
    velocity: [0, 3 * calculateOrbitalVelocity(300000, 100, 0.1), 0],
    mass: 20,
    radius: 1.0,
    color: "#4fc3f7",
  },
];

export function PlanetSystem() {
  const {world} = useRapier();
  const rigidBodyRefs = useRef([]);
  const planetPositions = useRef(new Map());
  const trails = useRef(new Map());

  // 注册刚体引用
  const registerRigidBody = useCallback((ref, name) => {
    if (ref && !rigidBodyRefs.current.find(item => item.name === name)) {
      rigidBodyRefs.current.push({ref, name});
    }
  }, []);

  // 更新星球位置
  const handlePositionUpdate = useCallback((name, position) => {
    planetPositions.current.set(name, position.clone());

    if (!trails.current.has(name)) {
      trails.current.set(name, []);
    }
    const trail = trails.current.get(name);
    trail.push(position.clone());

    // 根据星球类型调整轨迹长度
    const maxTrailLength = name === "sun" ? 0 : 3000; // 太阳不显示轨迹
    if (trail.length > maxTrailLength) {
      trail.shift();
    }
  }, []);

  // 改进的引力计算
  // 改进的引力计算
  useFrame(() => {
    const bodies = rigidBodyRefs.current.filter(item => item.ref?.current);

    // 添加调试信息
    console.log('注册的刚体数量:', rigidBodyRefs.current.length);
    console.log('有效的刚体数量:', bodies.length);

    if (bodies.length < 2) {
      console.log('刚体数量不足，无法计算引力');
      return;
    }

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const body1 = bodies[i].ref.current;
        const body2 = bodies[j].ref.current;

        if (!body1 || !body2) continue;

        const pos1 = body1.translation();
        const pos2 = body2.translation();

        // 计算距离向量
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // 防止碰撞时的异常力
        const minDistance = Math.max(0.5, (body1.mass() + body2.mass()) * 0.01);
        if (distance < minDistance) continue;

        const mass1 = body1.mass();
        const mass2 = body2.mass();

        // 引力大小计算
        const force = G * mass1 * mass2 / (distance * distance);

        // 单位方向向量
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        const fz = (dz / distance) * force;

        // 应用引力
        body1.addForce({x: fx, y: fy, z: fz}, true);
        body2.addForce({x: -fx, y: -fy, z: -fz}, true);
      }
    }
  });

  return (
    <>
      {planetConfigs.map((config) => (
        <Planet
          key={config.name}
          {...config}
          onPositionUpdate={handlePositionUpdate}
          onRigidBodyRef={(ref) => registerRigidBody(ref, config.name)}
        />
      ))}

      {/* 只渲染非太阳星球的轨迹 */}
      {Array.from(trails.current.entries())
        .filter(([name]) => name !== "sun")
        .map(([name, trail]) => (
          <TrailRenderer
            key={`trail-${name}`}
            points={trail}
            color={planetConfigs.find(p => p.name === name)?.color || "#ffffff"}
          />
        ))}
    </>
  );
}
