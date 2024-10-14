import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { thickness } from "three/webgpu";

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
    particleCount: 10000,
    particleSize: 0.02,
    radius: 5,
    branches: 10,
    thickness: 0.1,
    spin: 0.4,
    randomness: 0.5,
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
    storeData.canvasSize.height
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
    0.1,
    100
  );
  camera.position.set(
    storeData.cameraData.beginPos.x,
    storeData.cameraData.beginPos.y,
    storeData.cameraData.beginPos.z
  );
  return camera;
}

/**
 * Controls function
 */
function createControls() {
  const controls = new OrbitControls(
    storeData.camera,
    storeData.renderer.domElement
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
  const positionArray = new Float32Array(
    storeData.galaxyData.particleCount * 3
  );
  const colorArray = new Float32Array(storeData.galaxyData.particleCount * 3);

  for (let index = 0; index < storeData.galaxyData.particleCount; index++) {
    const i3 = index * 3;
    const radius = Math.random() * storeData.galaxyData.radius;
    const branchesAngle =
      ((index % storeData.galaxyData.branches) /
        storeData.galaxyData.branches) *
      (Math.PI * 2);
    const spinAngle = radius * storeData.galaxyData.spin;

    const randomX = (Math.random() - 0.5) * storeData.galaxyData.randomness;
    const randomY = (Math.random() - 0.5) * storeData.galaxyData.randomness;
    const randomZ = (Math.random() - 0.5) * storeData.galaxyData.randomness;

    // position
    positionArray[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
    positionArray[i3 + 1] =
      (Math.random() - 0.5) * storeData.galaxyData.thickness + randomY;
    positionArray[i3 + 2] =
      Math.sin(branchesAngle + spinAngle) * radius + randomZ;

    // color
    colorArray[i3] = Math.random();
    colorArray[i3 + 1] = Math.random();
    colorArray[i3 + 2] = Math.random();
  }

  storeData.galaxyData.particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  storeData.galaxyData.particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorArray, 3)
  );

  storeData.galaxyData.particlesMaterial = new THREE.PointsMaterial({
    size: storeData.galaxyData.particleSize,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite: false,
  });

  storeData.galaxyData.particlesMesh = new THREE.Points(
    storeData.galaxyData.particlesGeometry,
    storeData.galaxyData.particlesMaterial
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
  storeData.gui = new GUI({ width: 400 });
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
    .add(storeData.galaxyData, "particleSize")
    .min(0.01)
    .max(1)
    .step(0.01)
    .name("Galaxy Partical Size")
    .onFinishChange(createGalaxy);
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
    .add(storeData.galaxyData, "thickness")
    .min(0.01)
    .max(1)
    .step(0.01)
    .name("Galaxy Thickness")
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
}

/**
 * render function
 */
function render() {
  // galaxy spin
  // storeData.galaxyData.particlesMesh.rotation.y += storeData.galaxyData.spin;

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
