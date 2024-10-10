import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1280 / 720, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(1280, 720);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// add axis helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const time = new THREE.Clock();

const render = function () {
  const elapsedTime = time.getElapsedTime();

  cube.position.y = Math.sin(elapsedTime) * 2;
  cube.position.x = Math.cos(elapsedTime) * 2;

  camera.lookAt(cube.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
