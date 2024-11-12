import {OrbitControls} from "@react-three/drei";
import {folder, useControls} from "leva";
import {Perf} from "r3f-perf";
import Lights from "../components/simple_game/Lights.jsx";
import Level, {Levels} from "../components/simple_game/Level.jsx";
import {Physics} from "@react-three/rapier";
import PlayerScoreGui from "../components/simple_game/PlayerScoreGui.jsx";
import PlayerProvider from "../components/simple_game/PlayerContext.jsx";
import PlayerControlGui from "../components/simple_game/PlayerControlGui.jsx";

export default function SimpleGameView() {

  const defaultSceneItemsDebugData = {
    disableOrbitControls: {
      value: true,
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
      <PlayerScoreGui/>
      <PlayerControlGui/>
      <Physics debug={true}>
        <Lights/>
        <Level level={Levels.HARD}/>
      </Physics>
    </PlayerProvider>
  </>;
}
