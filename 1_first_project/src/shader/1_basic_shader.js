import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

import planeFragmentShader from "./1_basic_shader_shaders/1_plane_fragment.glsl";
import planeVertexShader from "./1_basic_shader_shaders/1_plane_vertex.glsl";

import animationFlagFragmentShader from "./1_basic_shader_shaders/2_animation_flag_fragment.glsl";
import animationFlagVertexShader from "./1_basic_shader_shaders/2_animation_flag_vertex.glsl";

import circleFragmentShader from "./1_basic_shader_shaders/3_circle_fragment.glsl";
import circleVertexShader from "./1_basic_shader_shaders/3_circle_vertex.glsl";

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
camera.position.set(0, 0, 3);
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
const planeMaterial = new THREE.RawShaderMaterial({
  vertexShader: planeVertexShader,
  fragmentShader: planeFragmentShader,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.x = -2.5;
// scene.add(plane);

// Animate Flag
const animateFlagGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const animateFlagMaterial = new THREE.RawShaderMaterial({
  vertexShader: animationFlagVertexShader,
  fragmentShader: animationFlagFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uHeight: {value: 0.5},
    uFrequency: {value: 10.0},
    uTime: {value: 0},
  },
});
const animateFlag = new THREE.Mesh(animateFlagGeometry, animateFlagMaterial);
animateFlag.position.x = 2.5;
// scene.add(animateFlag);

// Circle
const circleGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const circleMaterial = new THREE.ShaderMaterial({
  vertexShader: circleVertexShader,
  fragmentShader: circleFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {value: 0},
  },
});
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.x = 0;
scene.add(circle);

/**
 * Render
 */
const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();
  animateFlagMaterial.uniforms.uTime.value = elapsedTime * 2;
  circleMaterial.uniforms.uTime.value = elapsedTime;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
