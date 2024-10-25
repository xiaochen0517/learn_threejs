import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {
  DotScreenPass,
  EffectComposer,
  GammaCorrectionShader,
  GlitchPass,
  RenderPass,
  RGBELoader,
  RGBShiftShader,
  ShaderPass,
} from "three/addons";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import fragmentShader from "./7_post_processing/fragment.glsl";
import vertexShader from "./7_post_processing/vertex.glsl";

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
  // antialias: true,
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
 * Load env map
 */
const rgbeLoader = new RGBELoader();
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
 * Coffee cup
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/resources/model/coffee_cup/coffee_cup.gltf",
  (gltf) => {
    const coffeeCupModel = gltf.scene.children[1];
    coffeeCupModel.position.y = -0.8;
    scene.add(coffeeCupModel);
  },
);

/**
 * Light
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

/**
 * Post-processing
 */
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0,
});

const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(storeData.canvasSize.width, storeData.canvasSize.height);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
// gammaCorrectionPass.enabled = false;
effectComposer.addPass(gammaCorrectionPass);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const tintShader = {
  uniforms: {
    tDiffuse: new THREE.Uniform(null),
    uColor: new THREE.Uniform(new THREE.Color("black")),
    uStrength: new THREE.Uniform(0.1),
  },
  vertexShader,
  fragmentShader,
};
const tintPass = new ShaderPass(tintShader);
// tintPass.enabled = false;
effectComposer.addPass(tintPass);

gui.addColor(tintPass.material.uniforms.uColor, "value")
  .name("Tint color");
gui.add(tintPass.material.uniforms.uStrength, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Tint strength");

/**
 * Render
 */
const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  stats.update();
  // renderer.render(scene, camera);
  effectComposer.render();
  requestAnimationFrame(render);
}

render();
