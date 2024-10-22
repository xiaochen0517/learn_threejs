import * as THREE from "three";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(1280, 720);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x009900 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.rotation.y = Math.PI / 4;
cube.rotation.x = Math.PI / 8;

// add axis helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 透视投影相机
const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 1000);

// 正交投影相机
// const aspectRatio = 1280 / 720;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   1,
//   100
// );

camera.position.z = 3;

const render = function () {
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
