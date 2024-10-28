import {Canvas} from "@react-three/fiber";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import FirstFiberView from "./view/FirstFiberView.jsx";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <FirstFiberView/>,
    },
  ]);

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          position: [6, 6, 8],
        }}
      >
        <RouterProvider router={router}/>
      </Canvas>
    </>
  );
}

export default App;
