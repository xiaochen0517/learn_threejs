import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

/**
 * Init scene
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
renderer.shadowMap.enabled = true;

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Geometry
 */
// const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
// console.log("BoxGeometry", BoxGeometry);

/**
 * Textures loader
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load(
  "/resources/texture/particles/2.png"
);

/**
 * particles
 */
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const positionArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);

for (let index = 0; index < particlesCount * 3; index++) {
  positionArray[index] = (Math.random() - 0.5) * 10;
  colorArray[index] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colorArray, 3)
);

const pointMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  // blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.type = THREE.PCFSoftShadowMap;
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

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
camera.position.z = 5;
camera.position.y = 2;
camera.lookAt(new THREE.Vector3(0, 0, 0));
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
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const render = function () {
  const elapsedTime = clock.getElapsedTime();
  particles.rotation.y = elapsedTime * 0.1;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
