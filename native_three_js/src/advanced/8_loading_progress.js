import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {RGBELoader} from "three/addons";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

import fragmentShader from "./8_loading_progress/fragment.glsl";
import vertexShader from "./8_loading_progress/vertex.glsl";

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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;

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
  10000,
);
camera.position.set(0, 0, 5);
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
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  fragmentShader,
  vertexShader,
  uniforms: {
    uAlpha: {value: 1},
  },
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
overlay.position.z = -1;
scene.add(overlay);

/**
 * Html progress bar
 */
// 使用字符串模板创建一个div元素
const progressBar = `
<div style="position: fixed;width: 100vh;height: 100vh;display: flex;justify-content: center;align-items: center">
  <div id="progressDiv" style="font-size: 3rem;font-weight: bold;color: white;"></div>
</div>
`;
// 将div元素插入到body中
document.body.insertAdjacentHTML("afterbegin", progressBar);

const progressDiv = document.getElementById("progressDiv");

/**
 * Loading manager
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Started loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
loadingManager.onLoad = () => {
  console.log("Loading complete!");
  gsap.to(overlayMaterial.uniforms.uAlpha, {
    value: 0,
    duration: 1,
    delay: 1,
    onComplete: () => {
      scene.remove(overlay);
      overlayMaterial.dispose();
      overlayGeometry.dispose();
    },
  });
  gsap.to(progressDiv, {
    opacity: 0,
    duration: 1,
    delay: 1,
    onComplete: () => {
      progressDiv.style.display = "none";
    },
  });
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
  const ratio = ((itemsLoaded / itemsTotal) * 100).toFixed(2);
  progressDiv.innerText = `${ratio}%`;
};

/**
 * Load env map
 */
const rgbeLoader = new RGBELoader(loadingManager);
const hdrEnvMapTexture = rgbeLoader.load(
  "/resources/texture/ems/je_gray_02_2k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.encoding = THREE.sRGBEncoding;
  },
);
scene.background = hdrEnvMapTexture;
scene.environment = hdrEnvMapTexture;

/**
 * Coffee cup
 */
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load(
  "/resources/model/coffee_cup/coffee_cup.gltf",
  (gltf) => {
    const coffeeCupModel = gltf.scene.children[1];
    coffeeCupModel.position.y = -0.8;
    scene.add(coffeeCupModel);
  },
);

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
