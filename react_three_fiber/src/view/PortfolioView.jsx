import {ContactShadows, Environment, Float, Html, PresentationControls, Text} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useControls} from "leva";
import {Perf} from "r3f-perf";
import Macbook from "../components/portfolio/Macbook.jsx";

export default function PortfolioView() {

  const three = useThree();

  three.camera.position.set(1, 3, 4);
  three.camera.lookAt(1, 1, 0);

  const debugData = useControls({});

  return <>
    <Perf position="top-left" style={{marginTop: "3rem"}}/>
    {/*<axesHelper args={[5]}/>*/}
    <color attach="background" args={["#241a1a"]}/>

    <ambientLight intensity={2}/>
    <directionalLight position={[10, 10, 10]} intensity={2}/>

    <Environment preset="apartment" environmentIntensity={0.2}/>

    <PresentationControls
      global={true}
      rotation={[0.0, 0.4, 0.0]}
      polar={[-0.05, 0.15]}
      azimuth={[-0.7, 0.5]}
      config={{mass: 2, tension: 200, friction: 26}}
    >
      <Float rotationIntensity={0.5}>
        <Macbook>
          <Html
            transform={true}
            wrapperClass="htmlScreen"
            distanceFactor={1.17}
            position={[0, 1.53, -1.4]}
            rotation-x={-0.256}
          >
            <iframe src="https://threejs.org/"/>
          </Html>
        </Macbook>
        <Text
          font="/fonts/HarmonyOS_Sans_SC_Black.ttf"
          fontSize={1}
          position={[4, 1.6, -1]}
          rotation-x={-0.15}
          rotation-y={-Math.PI / 2}
          maxWidth={6}
          textAlign="center"
        >
          Use Three.js CreatedBy mas0n1ee
        </Text>
      </Float>
    </PresentationControls>

    <ContactShadows position-y={-1} opacity={0.5} scale={5} blur={2.4}/>
  </>;
}
