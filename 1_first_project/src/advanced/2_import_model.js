import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const storeData = {
  canvasSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
};

/**
 * Init Scene
 */
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(storeData.canvasSize.width, storeData.canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * GUI
 */
const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.dom);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  storeData.canvasSize.width / storeData.canvasSize.height,
  0.1,
  100
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * Helper
 */
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

/**
 * Load Manager
 */
const loadManager = new THREE.LoadingManager();
loadManager.onStart = () => {
  console.log("Loading started");
};
loadManager.onLoad = () => {
  console.log("Loading finished");
};
loadManager.onProgress = (url, loaded, total) => {
  console.log(`Loading ${Math.floor((loaded / total) * 100)}%`);
};

/**
 * Model Loader
 */
const loader = new GLTFLoader(loadManager);
loader.load(
  "/resources/model/fox/fox_material_added.gltf",
  (gltf) => {
    scene.add(gltf.scene);
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

/**
 * Geometry
 */
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshStandardMaterial();
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// box.castShadow = true;
// box.receiveShadow = true;
// scene.add(box);

/**
 * Render
 */
const clock = new THREE.Clock();
function render() {
  const delta = clock.getDelta();
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
