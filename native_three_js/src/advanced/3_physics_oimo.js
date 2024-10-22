import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as OIMO from "oimo";

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
camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);
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
 * Physics
 */
const world = new OIMO.World({
  timestep: 1 / 60,
  iterations: 8,
  broadphase: 2,
  worldscale: 1,
  random: true,
  info: true,
  gravity: [0, -9.82, 0],
});

const ground = world.add({
  type: "box",
  size: [40, 1, 40],
  pos: [0, -0.5, 0],
  rot: [0, 0, 0],
  move: false,
  density: 1,
  friction: 0.6,
  restitution: 0.2,
});

/**
 * Geometry
 */

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x989898,
  metalness: 0.2,
  roughness: 0.2,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const geometryMaterial = new THREE.MeshStandardMaterial({
  color: 0xdfdfdf,
  metalness: 0.2,
  roughness: 0.2,
});
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const needUpdateObjs = [];

function createBox(boxSize, boxPosition) {
  const box = new THREE.Mesh(boxGeometry, geometryMaterial);
  box.scale.set(boxSize.width, boxSize.height, boxSize.depth);
  box.position.set(boxPosition.x, boxPosition.y, boxPosition.z);
  scene.add(box);

  const boxBody = world.add({
    type: "box",
    size: [boxSize.width, boxSize.height, boxSize.depth],
    pos: [boxPosition.x, boxPosition.y, boxPosition.z],
    rot: [0, 0, 0],
    move: true,
    density: 1,
    friction: 0.6,
    restitution: 0.2,
  });

  needUpdateObjs.push({ obj: box, body: boxBody });
}

function createBall(ballSize, ballPosition) {
  const ball = new THREE.Mesh(ballGeometry, geometryMaterial);
  ball.scale.set(ballSize, ballSize, ballSize);
  ball.position.set(ballPosition.x, ballPosition.y, ballPosition.z);
  scene.add(ball);

  const ballBody = world.add({
    type: "sphere",
    size: [ballSize],
    pos: [ballPosition.x, ballPosition.y, ballPosition.z],
    rot: [0, 0, 0],
    move: true,
    density: 1,
    friction: 0.6,
    restitution: 0.2,
  });

  needUpdateObjs.push({ obj: ball, body: ballBody });
}

gui.add(
  {
    addObject: () => {
      if (Math.random() > 0.5) {
        createBall(Math.random() * 0.5 + 0.5, {
          x: (Math.random() - 0.5) * 5,
          y: 10,
          z: (Math.random() - 0.5) * 5,
        });
      } else {
        createBox(
          {
            width: Math.random() * 0.5 + 0.5,
            height: Math.random() * 0.5 + 0.5,
            depth: Math.random() * 0.5 + 0.5,
          },
          {
            x: (Math.random() - 0.5) * 5,
            y: 10,
            z: (Math.random() - 0.5) * 5,
          }
        );
      }
    },
  },
  "addObject"
);

/**
 * Render
 */
const clock = new THREE.Clock();
function render() {
  const delta = clock.getDelta();

  world.step();

  needUpdateObjs.forEach(({ obj, body }) => {
    obj.position.copy(body.getPosition());
    obj.quaternion.copy(body.getQuaternion());
  });

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
