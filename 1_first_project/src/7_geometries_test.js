import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
// const material = new THREE.MeshBasicMaterial({
//   color: 0x009900,
//   wireframe: true,
// });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const bufferGeometry = new THREE.BufferGeometry();
const pointsCount = 100;
const positions = new Float32Array(pointsCount * 3 * 3);
for (let i = 0; i < pointsCount * 3 * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 1;
}
bufferGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const material = new THREE.MeshBasicMaterial({
  color: 0x009900,
  wireframe: true,
});
const points = new THREE.Mesh(bufferGeometry, material);
scene.add(points);

const boxHelper = new THREE.BoxHelper(points, 0xffff00);
scene.add(boxHelper);

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
