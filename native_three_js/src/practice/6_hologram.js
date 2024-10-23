import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

import fragmentShader from "./6_hologram/fragment.glsl";
import vertexShader from "./6_hologram/vertex.glsl";

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
camera.position.set(0, 0, 4);

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
  fragmentShader,
  vertexShader,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uNoiseTexture: new THREE.Uniform(noiseTexture),
    uColor: new THREE.Uniform(new THREE.Color(0x70c1ff)),
  },
});

gui.addColor(hologramMaterial.uniforms.uColor, "value")
  .name("Color");

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.25, 0.15, 128, 16);
const torusKnot = new THREE.Mesh(torusKnotGeometry, hologramMaterial);
scene.add(torusKnot);

const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ball = new THREE.Mesh(ballGeometry, hologramMaterial);
ball.position.set(2, 0, 0);
scene.add(ball);


/**
 * Render
 */
const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);
  hologramMaterial.uniforms.uTime.value = elapsedTime;

  // torusKnot.rotation.y = elapsedTime * 0.2;
  // torusKnot.rotation.x = elapsedTime * 0.3;
  // ball.rotation.y = elapsedTime * 0.2;
  // ball.rotation.x = elapsedTime * 0.3;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
