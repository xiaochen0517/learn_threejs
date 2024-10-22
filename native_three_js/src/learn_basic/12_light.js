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

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Geometry
 */

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.7,
  roughness: 0.2,
});

const sphereGeometry = new THREE.SphereGeometry(0.5, 100, 100);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);

scene.add(sphereMesh);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 100, 100);
const planeMesh = new THREE.Mesh(planeGeometry, material);
planeMesh.rotation.x = -Math.PI * 0.5;
planeMesh.position.y = -0.5;
scene.add(planeMesh);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.5);
directionalLight.position.set(2, 2, 2);
// scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5);
// scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 1, 100, 1);
pointLight.position.set(2, 2, 2);
// scene.add(pointLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 4, 1, 1);
rectAreaLight.position.set(2, 2, -2);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const spotLight = new THREE.SpotLight(0x00ff00, 1, 100, Math.PI * 0.1, 0.1, 1);
spotLight.position.set(2, 2, 2);
spotLight.target.position.set(0, 0, 0);
// scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

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
