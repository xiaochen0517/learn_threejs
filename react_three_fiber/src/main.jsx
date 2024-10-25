import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {Canvas} from "@react-three/fiber";
import {StrictMode} from "react";

createRoot(document.getElementById("root"))
  .render(
    <>
      <StrictMode>
        <Canvas>
          <App/>
        </Canvas>
      </StrictMode>
    </>,
  );
