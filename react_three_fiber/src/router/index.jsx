import {createBrowserRouter} from "react-router-dom";
import FirstFiberView from "../view/FirstFiberView.jsx";
import TryDreiView from "../view/TryDreiView.jsx";
import HomeView from "../view/HomeView.jsx";
import DebugView from "../view/DebugView.jsx";
import EnvAndStageView from "../view/EnvAndStageView.jsx";
import LoadModelView from "../view/LoadModelView.jsx";
import Text3DView from "../view/Text3DView.jsx";
import MouseEventView from "../view/MouseEventView.jsx";
import PostProcessingView from "../view/PostProcessingView.jsx";
import PortfolioView from "../view/PortfolioView.jsx";
import TransferArrayView from "../view/TransferArrayView.jsx";
import PhysicsView from "../view/PhysicsView.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    title: "Home",
    element: <HomeView/>,
  },
  {
    path: "/first-fiber",
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
  {
    path: "/transfer-array",
    title: "Transfer Array",
    element: <TransferArrayView/>,
  },
  {
    path: "/physics",
    title: "Physics",
    element: <PhysicsView/>,
  },
], {
  basename: "/",
});

console.log("router", router);
