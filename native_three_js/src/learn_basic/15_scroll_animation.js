import "./15_scroll_animation.css";
import * as THREE from "three";

const scrollAnimationElement = document.querySelector("#scrollAnimation");
if (scrollAnimationElement) {
  scrollAnimationElement.style.display = "block";
} else {
  console.error("Element with class 'scrollAnimation' not found.");
}

/**
 * Init scene
 */
const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Texture loader
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load(
  "/resources/texture/gradients/3.jpg"
);
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Geometry
 */
const toonMaterial = new THREE.MeshToonMaterial({
  color: 0xfffdfd,
  gradientMap: gradientTexture,
  flatShading: true,
});

const torusGeometry = new THREE.TorusGeometry(0.5, 0.25, 23, 96);
const torus = new THREE.Mesh(torusGeometry, toonMaterial);
scene.add(torus);

const coneGeometry = new THREE.ConeGeometry(0.7, 1.2, 42);
const cone = new THREE.Mesh(coneGeometry, toonMaterial);
scene.add(cone);

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 128, 16);
const torusKnot = new THREE.Mesh(torusKnotGeometry, toonMaterial);
scene.add(torusKnot);

// init position
const objectDistance = 4;

torus.position.y = -objectDistance * 0;
cone.position.y = -objectDistance * 1;
torusKnot.position.y = -objectDistance * 2;

const objects = [torus, cone, torusKnot];

/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;
  posArray[i3] = (Math.random() - 0.5) * 10;
  posArray[i3 + 1] = (Math.random() - 0.8) * objectDistance * objects.length;
  posArray[i3 + 2] = (Math.random() - 0.5) * 10;

  colorArray[i3] = Math.random();
  colorArray[i3 + 1] = Math.random();
  colorArray[i3 + 2] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colorArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  transparent: true,
  vertexColors: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.type = THREE.PCFSoftShadowMap;
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
// scene.add(directionalLightHelper);

/**
 * add axis helper
 */
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  35,
  canvasSize.width / canvasSize.height,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.x = -0.5;

/**
 * Resize
 */
window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;

  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(canvasSize.width, canvasSize.height);
});

let cameraTargetY = 0;
scrollAnimationElement.addEventListener("scroll", () => {
  const scrollHeight = scrollAnimationElement.scrollHeight;
  const scrollTop = scrollAnimationElement.scrollTop;
  const scrollRatio = scrollTop / scrollHeight;

  const canvasHeight = objectDistance * objects.length;
  cameraTargetY = -scrollRatio * canvasHeight;
});

const clock = new THREE.Clock();
const render = function () {
  const elapsedTime = clock.getElapsedTime();

  particles.rotation.y = elapsedTime * 0.1;

  // move camera
  camera.position.y = cameraTargetY;

  objects.forEach((object, index) => {
    object.rotation.x = elapsedTime * 0.2;
    object.rotation.y = elapsedTime * 0.25;
  });

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
