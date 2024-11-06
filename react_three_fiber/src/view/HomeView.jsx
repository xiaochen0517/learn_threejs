import {Html} from "@react-three/drei";
import {router} from "../router/index.jsx";
import {useNavigate} from "react-router-dom";

export default function HomeView() {

  const navigate = useNavigate();

  return <>
    <Html fullscreen={true} transform={false} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <div className="w-full h-full overflow-y-auto bg-neutral-50">
        <h1 className="p-2 font-bold text-2xl">Learn threejs projects</h1>
        <nav>
          <ul className="flex flex-row flex-wrap border-b">
            {
              router.routes.map((route, index) => (
                route.path === "/" ? null :
                  <li key={index} className="w-1/2 p-2">
                    <div
                      className="p-2 flex flex-col gap-2 cursor-pointer rounded-md border shadow-md bg-neutral-100"
                      onClick={() => navigate(route.path)}
                    >
                      <img src={`/images/${route.path}.png`} alt={route.title} className="w-full aspect-square border rounded-t-md"/>
                      <button className="rounded-md shadow border bg-cyan-600 hover:bg-cyan-700 text-neutral-50">
                        {route.title}
                      </button>
                    </div>
                  </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </Html>
  </>;
}
