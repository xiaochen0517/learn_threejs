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

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,
  roughness: 0.2,
});

const sphereGeometry = new THREE.SphereGeometry(0.5, 100, 100);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);

sphereMesh.castShadow = true;

scene.add(sphereMesh);

const planeGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
const planeMesh = new THREE.Mesh(planeGeometry, material);
planeMesh.rotation.x = -Math.PI * 0.5;
planeMesh.position.y = -0.5;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

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
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
