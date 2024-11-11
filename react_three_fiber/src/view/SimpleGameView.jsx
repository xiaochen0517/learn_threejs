import {OrbitControls} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import Lights from "../components/simple_game/Lights.jsx";
import Level from "../components/simple_game/Level.jsx";
import {Physics} from "@react-three/rapier";
import GameGui from "../components/simple_game/GameGui.jsx";
import PlayerProvider from "../components/simple_game/PlayerContext.jsx";

export default function SimpleGameView() {

  const three = useThree();

  three.camera.position.set(0, 8, 2);
  three.camera.lookAt(0, 0, 0);

  const defaultSceneItemsDebugData = {
    disableOrbitControls: {
      value: false,
      label: "Disable Orbit Controls",
    },
  };

  const debugData = useControls({
    defaultSceneData: folder(defaultSceneItemsDebugData, {collapsed: false}),
  });

  return <>

    <Perf position="top-left"/>

    {debugData.disableOrbitControls ? <></> : <OrbitControls makeDefault/>}
    <PlayerProvider>
      <GameGui/>
      <Physics debug={true}>
        <Lights/>
        <Level/>
      </Physics>
    </PlayerProvider>
  </>;
}
