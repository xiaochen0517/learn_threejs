import {OrbitControls} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useControls} from "leva";
import {Perf} from "r3f-perf";
import TransferArrayModel from "../components/transfer_array/TransferArrayModel.jsx";
import {Bloom, EffectComposer} from "@react-three/postprocessing";

export default function TransferArrayView() {

  const three = useThree();

  three.camera.position.set(0, 2, 7);
  three.camera.lookAt(0, 0, 0);

  const debugData = useControls({});

  return <>
    <Perf position="top-left"/>

    <OrbitControls makeDefault/>

    {/*<ambientLight intensity={1.0}/>*/}
    {/*<directionalLight position={[10, 10, 10]}/>*/}

    {/*<axesHelper args={[5]}/>*/}

    <color attach="background" args={["#1a1a1a"]}/>

    <TransferArrayModel/>

    <EffectComposer>
      <Bloom intensity={1}/>
    </EffectComposer>
  </>;
}
