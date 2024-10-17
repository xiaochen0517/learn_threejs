import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

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
 * Load env map
 */
// default env map
// const textureLoader = new THREE.TextureLoader();
// const envMapTexture = textureLoader.load(
//   "/resources/texture/ems/environment_map.png",
//   (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     texture.encoding = THREE.sRGBEncoding;
//   }
// );

// hdr env map
const rgbeLoader = new RGBELoader();
const hdrEnvMapTexture = rgbeLoader.load(
  "/resources/texture/ems/zwartkops_straight_morning_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.encoding = THREE.sRGBEncoding;
  }
);
scene.environment = hdrEnvMapTexture;

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
camera.position.set(0, 0, 5);
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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 0);
directionalLight.castShadow = true;

// scene.add(ambientLight, directionalLight);

/**
 * Geometry
 */
const geometryMaterial = new THREE.MeshStandardMaterial({
  color: 0xdfdfdf,
  metalness: 1,
  roughness: 0.2,
});
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.22, 100, 16);
const torusKnot = new THREE.Mesh(torusKnotGeometry, geometryMaterial);
torusKnot.position.set(0, 0, 0);
scene.add(torusKnot);

/**
 * Render
 */
const clock = new THREE.Clock();
function render() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
