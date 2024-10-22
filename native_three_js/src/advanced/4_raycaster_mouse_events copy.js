import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(storeData.canvasSize.width, storeData.canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Load env map
 */
const textureLoader = new THREE.TextureLoader();
const envMapTexture = textureLoader.load(
  "/resources/texture/ems/environment_map.png",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.encoding = THREE.sRGBEncoding;
  }
);
// scene.background = envMapTexture;
scene.environment = envMapTexture;

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
  75,
  storeData.canvasSize.width / storeData.canvasSize.height,
  0.1,
  100
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
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

/**
 * Geometry
 */

const geometryMaterial = new THREE.MeshStandardMaterial({
  color: 0xdfdfdf,
  metalness: 0.2,
  roughness: 0.2,
});
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);

const ballLeft = new THREE.Mesh(ballGeometry, geometryMaterial.clone());
const ballMiddle = new THREE.Mesh(ballGeometry, geometryMaterial.clone());
const ballRight = new THREE.Mesh(ballGeometry, geometryMaterial.clone());

const ballBehind = new THREE.Mesh(ballGeometry, geometryMaterial.clone());

ballLeft.position.set(-4, 0, 0);
ballMiddle.position.set(0, 0, 0);
ballRight.position.set(4, 0, 0);

ballBehind.position.set(0, 0, -4);

scene.add(ballLeft, ballMiddle, ballRight, ballBehind);

const ballList = [ballLeft, ballMiddle, ballRight, ballBehind];

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// create a red ball to show the intersection point
const redBalls = [];
const redBallGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const redBallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
for (let i = 0; i < ballList.length; i++) {
  const redBall = new THREE.Mesh(redBallGeometry, redBallMaterial);
  scene.add(redBall);
  redBalls.push(redBall);
}

/**
 * Mouse
 */
const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / storeData.canvasSize.width) * 2 - 1;
  mousePosition.y = -(event.clientY / storeData.canvasSize.height) * 2 + 1;
});

/**
 * Render
 */
const clock = new THREE.Clock();
function render() {
  const elapsedTime = clock.getElapsedTime();

  raycaster.setFromCamera(mousePosition, camera);

  const intersects = raycaster.intersectObjects(ballList);

  // init red ball position to hide it
  for (let i = 0; i < redBalls.length; i++) {
    redBalls[i].position.set(-10, 0, 0);
  }
  // reset the color of the ball
  for (const ballObj of ballList) {
    ballObj.material.color.set(0xdfdfdf);
  }

  for (let i = 0; i < intersects.length; i++) {
    redBalls[i].position.copy(intersects[i].point);
    intersects[i].object.material.color.set(0xff0000);
  }

  // move the ball
  ballLeft.position.y = Math.sin((elapsedTime + 2) * 2) * 2;
  ballMiddle.position.y = Math.sin((elapsedTime + 1) * 2) * 2;
  ballRight.position.y = Math.sin((elapsedTime + 0) * 2) * 2;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
