import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import fragmentShader from "./5_coffee_cup/fragment.glsl";
import vertexShader from "./5_coffee_cup/vertex.glsl";

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
camera.position.set(0, 5, 8);

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

/**
 * Helper
 */
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 3);
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

/**
 * Load Model
 */
const loader = new GLTFLoader();
loader.load(
  "/resources/model/coffee_cup/coffee_cup.gltf",
  (gltf) => {
    // shadow
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(gltf.scene);
  },
);

/**
 * Load berlin noise texture
 */
const loaderTexture = new THREE.TextureLoader();
const noiseTexture = loaderTexture.load("/resources/texture/noise/noiseTexture.png");

/**
 * Smoke
 */
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 12, 40);
const smokeMaterial = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uNoiseTexture: new THREE.Uniform(noiseTexture),
  },
});
const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.translateY(0.5);
smoke.scale.set(1, 3, 1);
smoke.position.y = 2.8;
scene.add(smoke);

/**
 * Render
 */
const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();

  smokeMaterial.uniforms.uTime.value = elapsedTime * 0.5;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
