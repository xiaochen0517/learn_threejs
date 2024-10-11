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
// materialImage.src = "/resources/texture/metal/Metal021_4K_Color.jpg";

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
  "/resources/texture/metal/Metal021_4K_Color.jpg"
);
metalColorTexture.colorSpace = THREE.SRGBColorSpace;
const metalDisplacementTexture = textureLoader.load(
  "/resources/texture/metal/Metal021_4K_Displacement.jpg"
);
const metalMetalnessTexture = textureLoader.load(
  "/resources/texture/metal/Metal021_4K_Metalness.jpg"
);
const metalNormalDXTexture = textureLoader.load(
  "/resources/texture/metal/Metal021_4K_NormalDX.jpg"
);
const metalNormalGLTexture = textureLoader.load(
  "/resources/texture/metal/Metal021_4K_NormalGL.jpg"
);
const metalRoughnessTexture = textureLoader.load(
  "/resources/texture/metal/Metal021_4K_Roughness.jpg"
);

// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const envMapTexture = textureLoader.load(
  "/resources/texture/ems/environment_map.png",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.encoding = THREE.sRGBEncoding;
  }
);

/**
 * Geometry
 */
// const material = new THREE.MeshBasicMaterial({
//   wireframe: false,
//   map: metalColorTexture,
// });

// const material = new THREE.MeshNormalMaterial({
//   normalMap: metalNormalGLTexture,
// });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: metalColorTexture,
// });

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;

// const material = new THREE.MeshToonMaterial();

const material = new THREE.MeshStandardMaterial({
  map: metalColorTexture,
  displacementMap: metalDisplacementTexture,
  displacementScale: 0.1,
  metalnessMap: metalMetalnessTexture,
  normalMap: metalNormalGLTexture,
  roughnessMap: metalRoughnessTexture,
  envMap: envMapTexture,
});

// Sphere geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 100, 100);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1.5;

// Plane geometry
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const planeMesh = new THREE.Mesh(planeGeometry, material);

// Torus geometry
const torusGeometry = new THREE.TorusGeometry(0.3, 0.15, 16, 100);
const torusMesh = new THREE.Mesh(torusGeometry, material);
torusMesh.position.x = 1.5;

scene.add(sphereMesh, planeMesh, torusMesh);

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 3;
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

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

const clock = new THREE.Clock();

const render = function () {
  const elapsedTime = clock.getElapsedTime();

  sphereMesh.rotation.y = elapsedTime * 0.5;
  planeMesh.rotation.y = elapsedTime * 0.5;
  torusMesh.rotation.y = elapsedTime * 0.5;

  sphereMesh.rotation.x = elapsedTime * 0.5;
  planeMesh.rotation.x = elapsedTime * 0.5;
  torusMesh.rotation.x = elapsedTime * 0.5;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
