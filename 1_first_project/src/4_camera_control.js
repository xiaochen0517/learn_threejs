import * as THREE from "three";

const canvasSize = {
  width: 1280,
  height: 720,
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x009900 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// add axis helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  45,
  canvasSize.width / canvasSize.height,
  0.1,
  1000
);
camera.position.z = 3;

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = Math.min(event.clientX / canvasSize.width, 1) - 0.5;
  cursor.y = Math.min(event.clientY / canvasSize.height, 1) - 0.5;
});

const render = function () {
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.position.y = Math.sin(cursor.y * Math.PI * 2) * 3;
  camera.lookAt(cube.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
