import {createBrowserRouter, RouterProvider} from "react-router-dom";
import FirstFiberView from "./view/FirstFiberView.jsx";
import {Canvas} from "@react-three/fiber";
import TryDreiView from "./view/TryDreiView.jsx";
import HomeView from "./view/HomeView.jsx";

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
  ]);

  return (
    <>
      <nav>
        <ul className="p-2 flex flex-row gap-2 bg-neutral-100 border-b text-neutral-100 overflow-x-auto">
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
      <Canvas>
        <RouterProvider router={router}/>
      </Canvas>
    </>
  );
}

export default App;
