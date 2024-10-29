import {DoubleSide} from "three";
import {useEffect, useMemo, useRef} from "react";

export default function CustomMesh({position}) {

  const vertexCount = 10 * 3;

  const geometryRef = useRef();

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  });

  const positions = useMemo(() => {
    console.log("create positions");

    const positions = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }

    return positions;
  }, []);

  return (
    <mesh position={position || [0, 0, 0]}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={vertexCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshBasicMaterial color="yellow" side={DoubleSide}/>
    </mesh>
  );
}
