import {createBrowserRouter, RouterProvider} from "react-router-dom";
import FirstFiberView from "./view/FirstFiberView.jsx";
import {Canvas} from "@react-three/fiber";
import TryDreiView from "./view/TryDreiView.jsx";
import HomeView from "./view/HomeView.jsx";
import DebugView from "./view/DebugView.jsx";
import EnvAndStageView from "./view/EnvAndStageView.jsx";
import LoadModelView from "./view/LoadModelView.jsx";
import Text3DView from "./view/Text3DView.jsx";
import MouseEventView from "./view/MouseEventView.jsx";
import PostProcessingView from "./view/PostProcessingView.jsx";
import PortfolioView from "./view/PortfolioView.jsx";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      title: "Home",
      element: <HomeView/>,
    },
    {
      path: "/fist-fiber",
      title: "First Fiber Scene",
      element: <FirstFiberView/>,
    },
    {
      path: "/try-drei",
      title: "Try Drei",
      element: <TryDreiView/>,
    },
    {
      path: "/debug",
      title: "Debug",
      element: <DebugView/>,
    },
    {
      path: "/env-and-stage",
      title: "Env And Stage",
      element: <EnvAndStageView/>,
    },
    {
      path: "/load-model",
      title: "Load Model",
      element: <LoadModelView/>,
    },
    {
      path: "/text-3d",
      title: "Text 3D",
      element: <Text3DView/>,
    },
    {
      path: "/mouse-event",
      title: "Mouse Event",
      element: <MouseEventView/>,
    },
    {
      path: "/post-processing",
      title: "Post Processing",
      element: <PostProcessingView/>,
    },
    {
      path: "/portfolio",
      title: "Portfolio",
      element: <PortfolioView/>,
    },
  ]);

  return (
    <>
      <nav>
        <ul className="p-2 flex flex-row gap-2 bg-neutral-100 border-b text-neutral-100 overflow-x-auto text-nowrap">
          {
            router.routes.map((route, index) => (
              <li
                key={index}
                className="py-0.5 px-2 cursor-pointer text-neutral-100 bg-sky-600 border border-sky-700 rounded-lg hover:bg-sky-700 hover:border-sky-800 active:bg-sky-800"
              >
                <a href={route.path}>{route.title}</a>
              </li>
            ))
          }
        </ul>
      </nav>
      <Canvas className="touch-none" shadows={true}>
        <RouterProvider router={router}/>
      </Canvas>
    </>
  );
}

export default App;
