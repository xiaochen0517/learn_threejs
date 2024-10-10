import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Debug UI
 */
const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Texture with image object
 */
// const materialImage = new Image();
// const metalTexture = new THREE.Texture(materialImage);
// materialImage.onload = () => {
//   metalTexture.needsUpdate = true;
// };
// materialImage.src = "/resources/texture/Metal021_4K_Color.jpg";

/**
 * Texture with texture loader
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onProgress = (_, load, total) => {
  console.log("onProgress", Math.round((load / total) * 100) + "%");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onError = () => {
  console.log("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const metalColorTexture = textureLoader.load(
  "/resources/texture/Metal021_4K_Color.jpg"
);
const metalDisplacementTexture = textureLoader.load(
  "/resources/texture/Metal021_4K_Displacement.jpg"
);
const metalMetalnessTexture = textureLoader.load(
  "/resources/texture/Metal021_4K_Metalness.jpg"
);
const metalNormalDXTexture = textureLoader.load(
  "/resources/texture/Metal021_4K_NormalDX.jpg"
);
const metalNormalGLTexture = textureLoader.load(
  "/resources/texture/Metal021_4K_NormalGL.jpg"
);
const metalRoughnessTexture = textureLoader.load(
  "/resources/texture/Metal021_4K_Roughness.jpg"
);

/**
 * Geometry
 */
const ballGeometry = new THREE.SphereGeometry(0.75, 100, 100);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  wireframe: false,
  map: metalColorTexture,
  displacementMap: metalDisplacementTexture,
  displacementScale: 0.1,
  metalnessMap: metalMetalnessTexture,
  normalMap: metalNormalDXTexture,
  roughnessMap: metalRoughnessTexture,
});
const cube = new THREE.Mesh(ballGeometry, material);
scene.add(cube);

/**
 * add axis helper
 */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  45,
  canvasSize.width / canvasSize.height,
  0.1,
  1000
);
camera.position.z = 3;
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

/**
 * Resize
 */
window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;

  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(canvasSize.width, canvasSize.height);
});

/**
 * Full screen
 */
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const render = function () {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
