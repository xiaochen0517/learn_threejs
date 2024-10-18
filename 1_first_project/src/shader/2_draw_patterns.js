import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

import simpleFragmentShader from "./2_draw_patterns_shaders/1_simple_fragment.glsl";
import simpleVertexShader from "./2_draw_patterns_shaders/1_simple_vertex.glsl";

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
 * GUI
 */
const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.dom);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  storeData.canvasSize.width / storeData.canvasSize.height,
  0.1,
  100,
);
camera.position.set(0, 0, 7);
camera.lookAt(0, 0, 0);
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
 * Geometry
 */
// Plane
const planeGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: simpleVertexShader,
  fragmentShader: simpleFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.position.x = -2;
scene.add(plane);

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
