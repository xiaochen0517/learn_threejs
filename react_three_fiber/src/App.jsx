import {createBrowserRouter, RouterProvider} from "react-router-dom";
import FirstFiberView from "./view/FirstFiberView.jsx";
import {Canvas} from "@react-three/fiber";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <FirstFiberView/>,
    },
  ]);

  return (
    <>
      <div>
        <h1>React Three Fiber</h1>
        <nav>
          <ul>
            <li><a href="/">First Fiber View</a></li>
          </ul>
        </nav>
      </div>
      <Canvas>
        <RouterProvider router={router}/>
      </Canvas>
    </>
  );
}

export default App;
