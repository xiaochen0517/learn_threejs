import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

import fragmentShader from "./7_vertex_particle/fragment.glsl";
import vertexShader from "./7_vertex_particle/vertex.glsl";

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
renderer.shadowMap.type = THREE.VSMShadowMap;
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
scene.add(camera);
camera.position.set(0, 0, 2);

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

/**
 * Helper
 */
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

/**
 * Load berlin noise texture
 */
const loaderTexture = new THREE.TextureLoader();
const noiseTexture = loaderTexture.load("/resources/texture/noise/noiseTexture.png");
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

const hologramMaterial = new THREE.ShaderMaterial({
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  fragmentShader,
  vertexShader,
  transparent: true,
  depthWrite: false,
  // wireframe: true,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uParticleSize: new THREE.Uniform(2.0),
    uParticleScale: new THREE.Uniform(5.0),
    uNoiseTexture: new THREE.Uniform(noiseTexture),
  },
});

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.25, 0.15, 128, 16);
const torusKnotPoints = new THREE.Points(torusKnotGeometry, hologramMaterial);
scene.add(torusKnotPoints);

const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballPoints = new THREE.Points(ballGeometry, hologramMaterial);
ballPoints.position.set(1.2, 0, 0);
scene.add(ballPoints);

const torusGeometry = new THREE.TorusGeometry(0.35, 0.1, 16, 96);
const torusPoints = new THREE.Points(torusGeometry, hologramMaterial);
torusPoints.position.set(-1.2, 0, 0);
scene.add(torusPoints);


/**
 * Render
 */
const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();

  hologramMaterial.uniforms.uTime.value = elapsedTime;

  // torusKnotPoints.rotation.y = elapsedTime * 0.5;
  // ballPoints.rotation.y = elapsedTime * 0.5;
  // torusPoints.rotation.y = elapsedTime * 0.5;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
