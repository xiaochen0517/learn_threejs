import {RouterProvider} from "react-router-dom";
import {Canvas} from "@react-three/fiber";
import {router} from "./router/index.jsx";
import {KeyboardControls} from "@react-three/drei";

export default function App() {

  return (
    <KeyboardControls
      map={[
        {name: "forward", keys: ["KeyW", "ArrowUp"]},
        {name: "backward", keys: ["KeyS", "ArrowDown"]},
        {name: "left", keys: ["KeyA", "ArrowLeft"]},
        {name: "right", keys: ["KeyD", "ArrowRight"]},
        {name: "jump", keys: ["Space"]},
      ]}
    >
      <Canvas className="touch-none" shadows={true} gl={{ localClippingEnabled: true }}>
        <RouterProvider router={router}/>
      </Canvas>
    </KeyboardControls>
  );
}
