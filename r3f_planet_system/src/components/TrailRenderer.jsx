import {useMemo} from "react";
import * as THREE from "three";


export function TrailRenderer({points, color}) {
  const geometry = useMemo(() => {
    if (points.length < 2) return null;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    const alphas = new Float32Array(points.length);

    points.forEach((point, index) => {
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;

      // 渐变透明度效果
      alphas[index] = index / (points.length - 1);
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    return geometry;
  }, [points]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
  }, [color]);

  if (!geometry || points.length < 2) return null;

  return (
    <line geometry={geometry} material={material}/>
  );
}
