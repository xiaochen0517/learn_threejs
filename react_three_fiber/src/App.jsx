import {RouterProvider} from "react-router-dom";
import {Canvas} from "@react-three/fiber";
import {router} from "./router/index.jsx";

function App() {

  return (
    <Canvas className="touch-none" shadows={true}>
      <RouterProvider router={router}/>
    </Canvas>
  );
}

export default App;
