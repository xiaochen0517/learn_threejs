import {useLoader} from "@react-three/fiber";
import {DRACOLoader, GLTFLoader} from "three/addons";

export default function DuckModel() {

  const duckModel = useLoader(GLTFLoader, "/models/duck_draco/Duck.gltf", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  return <>
    <primitive object={duckModel.scene}/>
  </>
}
