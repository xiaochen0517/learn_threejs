import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import gsap from "gsap";

import fragmentShader from "./8_firework/fragment.glsl";
import vertexShader from "./8_firework/vertex.glsl";

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
const camera = new THREE.PerspectiveCamera(45, storeData.canvasSize.width / storeData.canvasSize.height, 0.1, 100);
scene.add(camera);
camera.position.set(0, 0, 5);

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
 * Load texture
 */
const loaderTexture = new THREE.TextureLoader();
const noiseTexture = loaderTexture.load("/resources/texture/noise/noiseTexture.png");
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

const particleTexture = loaderTexture.load("/resources/texture/particles/11.png");
particleTexture.flipY = false;
const spherical = new THREE.Spherical();

/**
 * create firework
 */
const createFirework = (count, texture, positions, radius, color) => {
  const fireworkPositionArray = new Float32Array(count * 3);
  const fireworkSizeArray = new Float32Array(count);
  const fireworkParticleLifetimeArray = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    spherical.radius = radius * THREE.MathUtils.randFloat(0.8, 1.2);
    spherical.phi = THREE.MathUtils.randFloat(0, Math.PI);
    spherical.theta = THREE.MathUtils.randFloat(0, Math.PI) * 2;

    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    fireworkPositionArray[i3] = position.x;
    fireworkPositionArray[i3 + 1] = position.y;
    fireworkPositionArray[i3 + 2] = position.z;

    fireworkSizeArray[i] = THREE.MathUtils.randFloat(0.5, 1.0);
    fireworkParticleLifetimeArray[i] = THREE.MathUtils.randFloat(1.0, 2.0);
  }

  const fireworkGeometry = new THREE.BufferGeometry();
  fireworkGeometry.setAttribute("position", new THREE.BufferAttribute(fireworkPositionArray, 3));
  fireworkGeometry.setAttribute("aSize", new THREE.BufferAttribute(fireworkSizeArray, 1));
  fireworkGeometry.setAttribute("aParticleLifetime", new THREE.BufferAttribute(fireworkParticleLifetimeArray, 1));

  const fireworkShaderMaterial = new THREE.ShaderMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    fragmentShader,
    vertexShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide, // wireframe: true,
    uniforms: {
      uProgress: new THREE.Uniform(0),
      uParticleSize: new THREE.Uniform(5.0),
      uParticleScale: new THREE.Uniform(20.0),
      uParticleTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(new THREE.Color(color)),
    },
  });

  const firework = new THREE.Points(fireworkGeometry, fireworkShaderMaterial);
  firework.position.copy(positions);
  scene.add(firework);

  const destroyFirework = () => {
    scene.remove(firework);
    fireworkGeometry.dispose();
    fireworkShaderMaterial.dispose();
  };
  gsap.to(fireworkShaderMaterial.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: destroyFirework,
  });
};

createFirework(500, particleTexture, new THREE.Vector3(0, 0, 0), 0.5, 0xffff00);

/**
 * Click Event
 */
let isDragging = false;
let mouseMoveSize = 0;
window.addEventListener("mousedown", () => {
  isDragging = false;
  mouseMoveSize = 0;
});
window.addEventListener("mousemove", (event) => {
  mouseMoveSize += Math.abs(event.movementX) + Math.abs(event.movementY);
  // 单次移动大小小于 5 像素，不触发拖动
  if (mouseMoveSize < 5) {
    return;
  }
  isDragging = true;
});
window.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    mouseMoveSize = 0;
    return;
  }
  const randomCount = Math.round(400 + Math.random() * 1000);
  const randomPosition = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    Math.random(),
    (Math.random() - 0.5) * 2,
  );
  const randomRadius = Math.random() * 0.5 + 0.5;
  const fireworkColor = new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`);
  createFirework(randomCount, particleTexture, randomPosition, randomRadius, fireworkColor);
});

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
