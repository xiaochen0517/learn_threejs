import * as THREE from "three";
import gsap from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
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

gsap.to(cube.position, {
  x: 2,
  duration: 1,
  delay: 1,
});
gsap.to(cube.position, {
  x: 0,
  duration: 1,
  delay: 2,
});

const render = function () {
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
