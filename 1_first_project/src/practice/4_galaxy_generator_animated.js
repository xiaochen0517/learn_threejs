import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import fragmentShader from "./4_galaxy_generator_animated_shader/fragment.glsl";
import vertexShader from "./4_galaxy_generator_animated_shader/vertex.glsl";

const storeData = {
  canvasSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: null,
  renderer: null,
  stats: null,
  gui: null,
  camera: null,
  cameraData: {
    beginPos: {
      x: 5,
      y: 5,
      z: 5,
    },
  },
  controls: null,
  galaxyData: {
    particlesGeometry: null,
    particlesMaterial: null,
    particlesMesh: null,
    particleCount: 20000,
    radius: 5,
    branches: 3,
    spin: 0.0,
    randomness: 0.5,
    randomnessPower: 3,
    colorInside: 0xff6030,
    colorOutside: 0x1b3984,
  },
};

/**
 * init function
 */
function init() {
  initRenderer();
  initScene();
  initHelper();
  initDebugUI();
}

function initRenderer() {
  storeData.renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  storeData.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  storeData.renderer.setSize(
    storeData.canvasSize.width,
    storeData.canvasSize.height,
  );
  storeData.renderer.shadowMap.enabled = true;
  document.body.appendChild(storeData.renderer.domElement);
}

function initScene() {
  storeData.scene = new THREE.Scene();
  storeData.camera = createCamera();
  storeData.scene.add(storeData.camera);
  storeData.controls = createControls();

  createGalaxy();
}

/**
 * Camera function
 */
function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    storeData.canvasSize.width / storeData.canvasSize.height,
    0.01,
    100,
  );
  camera.position.set(
    storeData.cameraData.beginPos.x,
    storeData.cameraData.beginPos.y,
    storeData.cameraData.beginPos.z,
  );
  return camera;
}

/**
 * Controls function
 */
function createControls() {
  const controls = new OrbitControls(
    storeData.camera,
    storeData.renderer.domElement,
  );
  controls.enableDamping = true;
  return controls;
}

/**
 * Galaxy function
 */
function createGalaxy() {
  // clean old galaxy
  if (storeData.galaxyData.particlesMesh) {
    storeData.scene.remove(storeData.galaxyData.particlesMesh);
  }
  if (storeData.galaxyData.particlesGeometry) {
    storeData.galaxyData.particlesGeometry.dispose();
  }
  if (storeData.galaxyData.particlesMaterial) {
    storeData.galaxyData.particlesMaterial.dispose();
  }

  // create new galaxy
  storeData.galaxyData.particlesGeometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(storeData.galaxyData.particleCount * 3);
  const colorArray = new Float32Array(storeData.galaxyData.particleCount * 3);
  const scaleArray = new Float32Array(storeData.galaxyData.particleCount);
  const positionRandomArray = new Float32Array(storeData.galaxyData.particleCount * 3);

  const colorInside = new THREE.Color(storeData.galaxyData.colorInside);
  const colorOutside = new THREE.Color(storeData.galaxyData.colorOutside);

  for (let index = 0; index < storeData.galaxyData.particleCount; index++) {
    const i3 = index * 3;
    // position
    const radius = Math.random() * storeData.galaxyData.radius;
    const branchesAngle = ((index % storeData.galaxyData.branches) / storeData.galaxyData.branches) * (Math.PI * 2);
    const spinAngle = radius * storeData.galaxyData.spin;

    positionArray[i3] = Math.cos(branchesAngle + spinAngle) * radius;
    positionArray[i3 + 1] = 0.0;
    positionArray[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius;

    // randomness
    const randomX = Math.pow(Math.random(), storeData.galaxyData.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * storeData.galaxyData.randomness * radius;
    const randomY = Math.pow(Math.random(), storeData.galaxyData.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * storeData.galaxyData.randomness * radius;
    const randomZ = Math.pow(Math.random(), storeData.galaxyData.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * storeData.galaxyData.randomness * radius;

    positionRandomArray[i3] = randomX;
    positionRandomArray[i3 + 1] = randomY;
    positionRandomArray[i3 + 2] = randomZ;

    // color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / storeData.galaxyData.radius);

    colorArray[i3] = mixedColor.r;
    colorArray[i3 + 1] = mixedColor.g;
    colorArray[i3 + 2] = mixedColor.b;

    scaleArray[index] = Math.random();
  }

  storeData.galaxyData.particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3),
  );
  storeData.galaxyData.particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorArray, 3),
  );
  storeData.galaxyData.particlesGeometry.setAttribute(
    "aScale",
    new THREE.BufferAttribute(scaleArray, 1),
  );
  storeData.galaxyData.particlesGeometry.setAttribute(
    "aPositionRandom",
    new THREE.BufferAttribute(positionRandomArray, 3),
  );

  storeData.galaxyData.particlesMaterial = new THREE.ShaderMaterial({
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fragmentShader,
    vertexShader,
    uniforms: {
      uTime: {value: 0},
      uSize: {value: 30.0 * storeData.renderer.getPixelRatio()},
    },
  });

  storeData.galaxyData.particlesMesh = new THREE.Points(
    storeData.galaxyData.particlesGeometry,
    storeData.galaxyData.particlesMaterial,
  );
  storeData.scene.add(storeData.galaxyData.particlesMesh);
}

/**
 * Helper function
 */
function initHelper() {
  const axesHelper = new THREE.AxesHelper(5);
  storeData.scene.add(axesHelper);
}

function initDebugUI() {
  storeData.stats = new Stats();
  document.body.appendChild(storeData.stats.dom);
  storeData.gui = new GUI({width: 400});
  initGalaxyDebug();
}

function initGalaxyDebug() {
  const galaxyFloder = storeData.gui.addFolder("Galaxy");
  galaxyFloder
    .add(storeData.galaxyData, "particleCount")
    .min(1000)
    .max(100000)
    .step(100)
    .name("Galaxy Partical Count")
    .onFinishChange(createGalaxy);
  galaxyFloder
    .add(storeData.galaxyData.particlesMaterial.uniforms.uSize, "value")
    .min(1)
    .max(10)
    .step(1)
    .name("Galaxy Partical Size");
  galaxyFloder
    .add(storeData.galaxyData, "radius")
    .min(1)
    .max(10)
    .step(1)
    .name("Galaxy Radius")
    .onFinishChange(createGalaxy);
  galaxyFloder
    .add(storeData.galaxyData, "branches")
    .min(1)
    .max(10)
    .step(1)
    .name("Galaxy Branches")
    .onFinishChange(createGalaxy);
  galaxyFloder
    .add(storeData.galaxyData, "spin")
    .min(-0.1)
    .max(2.0)
    .step(0.01)
    .name("Galaxy Spin")
    .onFinishChange(createGalaxy);
  galaxyFloder
    .add(storeData.galaxyData, "randomness")
    .min(0)
    .max(2)
    .step(0.01)
    .name("Galaxy Randomness")
    .onFinishChange(createGalaxy);
  galaxyFloder
    .add(storeData.galaxyData, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .name("Galaxy Randomness Power")
    .onFinishChange(createGalaxy);
}

/**
 * render function
 */
const clock = new THREE.Clock();

function render() {
  const startElapsedTime = clock.getElapsedTime() + 100.0;
  // galaxy spin
  storeData.galaxyData.particlesMaterial.uniforms.uTime.value = startElapsedTime;

  storeData.controls.update();
  storeData.stats.update();
  storeData.renderer.render(storeData.scene, storeData.camera);
  window.requestAnimationFrame(render);
}

/**
 * run function
 *
 */
function run() {
  init();
  render();
}

run();
