import {Root, Text} from "@react-three/uikit";
import {useContext, useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {PlayerContext} from "./PlayerContext.jsx";
import {Card} from "../apfel/card.jsx";

export default function GameGui() {

  const playBodyRef = useContext(PlayerContext);
  console.log("GameGui", playBodyRef.current);
  const guiRootRef = useRef();

  useEffect(() => {
    if (!playBodyRef.current) {
      return;
    }
    guiRootRef.current.rotation.x = -Math.PI * 0.1;
    guiRootRef.current.rotation.y = -Math.PI * 0.1;
  }, []);

  const updateGuiPosition = (state) => {
    if (!guiRootRef.current || !playBodyRef.current) {
      return;
    }
    const guiPosition = new THREE.Vector3();
    guiPosition.copy(playBodyRef.current.translation());
    guiPosition.z -= 0.25;
    guiPosition.y += 0.3;
    guiPosition.x += 0.75;
    guiRootRef.current.position.copy(guiPosition);
  };
  useFrame((state) => {
    updateGuiPosition(state);
  });

  return <group ref={guiRootRef}>
    <Root sizeX={0.8} sizeY={0.5} flexDirection="column">
      <Card borderRadius={32} padding={18} gap={1} flexDirection="column">
        <Text fontSize={12}>Hello World!</Text>
      </Card>
    </Root>
  </group>;
}
