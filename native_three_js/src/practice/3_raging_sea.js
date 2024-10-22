import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

import fragmentShader from "./3_raging_sea_shader/raging_sea_fragment.glsl";
import vertexShader from "./3_raging_sea_shader/raging_sea_vertex.glsl";

const storeData = {
  canvasSize: {
    width: window.innerWidth, height: window.innerHeight,
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
const gui = new GUI({
  width: 400,
});
const stats = new Stats();
document.body.appendChild(stats.dom);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, storeData.canvasSize.width / storeData.canvasSize.height, 0.1, 100);
camera.position.set(1, 1.5, 4);
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
const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};
// Plane
const planeGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  wireframe: false,
  uniforms: {
    uTime: {value: 0},
    uWaveHeight: {value: 0.15},
    uWaveFrequency: {value: new THREE.Vector2(4.0, 1.0)},
    uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
    uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
    uColorOffset: {value: 0.08},
    uColorMultiplier: {value: 5.0},
    uNoiseLayer: {value: 3},
  },
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI * -0.5;
scene.add(plane);

function addDebugGUI() {
  gui.add(planeMaterial, "wireframe")
     .name("Wireframe");

  gui.add(planeMaterial.uniforms.uWaveHeight, "value")
     .min(0)
     .max(1)
     .step(0.01)
     .name("Wave Height");

  gui.add(planeMaterial.uniforms.uWaveFrequency.value, "x")
     .min(0)
     .max(20)
     .step(0.01)
     .name("Wave Frequency X");

  gui.add(planeMaterial.uniforms.uWaveFrequency.value, "y")
     .min(0)
     .max(20)
     .step(0.01)
     .name("Wave Frequency Y");

  gui.addColor(debugObject, "depthColor")
     .onChange(() => {
       planeMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
     })
     .name("Depth Color");

  gui.addColor(debugObject, "surfaceColor")
     .onChange(() => {
       planeMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
     })
     .name("Surface Color");

  gui.add(planeMaterial.uniforms.uColorOffset, "value")
     .min(0)
     .max(1)
     .step(0.01)
     .name("Color Offset");

  gui.add(planeMaterial.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .step(0.1)
      .name("Color Multiplier");

  gui.add(planeMaterial.uniforms.uNoiseLayer, "value")
      .min(1)
      .max(10)
      .step(1)
      .name("Noise Layer Count");
}

addDebugGUI();

/**
 * Render
 */
const animateConfig = {
  animate: true,
  animateSpeed: 1,
};
gui.add(animateConfig, "animate")
   .name("Animate");
gui.add(animateConfig, "animateSpeed")
   .min(0)
   .max(20)
   .step(0.01)
   .name("Animate Speed");

const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();
  if (animateConfig.animate) {
    planeMaterial.uniforms.uTime.value = elapsedTime * animateConfig.animateSpeed;
  }

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
