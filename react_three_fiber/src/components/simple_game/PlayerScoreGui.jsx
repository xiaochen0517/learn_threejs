import {Root, Text} from "@react-three/uikit";
import {useContext, useEffect, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {PlayerContext} from "./PlayerContext.jsx";
import {Card} from "../apfel/card.jsx";

export default function PlayerScoreGui() {

  const playBodyRef = useContext(PlayerContext);
  const guiRootRef = useRef();

  useEffect(() => {
    if (!playBodyRef.current) {
      return;
    }
    guiRootRef.current.rotation.x = -Math.PI * 0.1;
    guiRootRef.current.rotation.y = -Math.PI * 0.1;
    guiRootRef.current.rotation.z = Math.PI * 0.03;
  }, []);

  const [smoothGuiPosition] = useState(() => new THREE.Vector3());
  const updateGuiPosition = () => {
    if (!guiRootRef.current || !playBodyRef.current) {
      return;
    }
    const guiPosition = new THREE.Vector3();
    guiPosition.copy(playBodyRef.current.translation());
    guiPosition.z += 0.5;
    guiPosition.y += 0.3;
    guiPosition.x += 0.75;
    smoothGuiPosition.lerp(guiPosition, 0.1);
    guiRootRef.current.position.copy(smoothGuiPosition);
  };
  useFrame((state) => {
    updateGuiPosition(state);
  });

  return <group ref={guiRootRef}>
    <Root flexDirection="column">
      <Card borderRadius={12} padding={6} gap={1} flexDirection="column">
        <Text fontSize={12}>Score: 10000</Text>
      </Card>
    </Root>
  </group>;
}
