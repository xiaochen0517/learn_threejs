import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
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
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

// Material
const defaultPhysicsMaterial = new CANNON.Material("defaultPhysicsMaterial");
const defaultPhysicsContactMaterial = new CANNON.ContactMaterial(
  defaultPhysicsMaterial,
  defaultPhysicsMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.defaultPhysicsContactMaterial = defaultPhysicsContactMaterial;

const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
  mass: 0,
  shape: groundShape,
  material: defaultPhysicsMaterial,
});
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

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

  const boxShape = new CANNON.Box(
    new CANNON.Vec3(boxSize.width / 2, boxSize.height / 2, boxSize.depth / 2)
  );
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(boxPosition.x, boxPosition.y, boxPosition.z),
    shape: boxShape,
  });
  world.addBody(boxBody);
  needUpdateObjs.push({ obj: box, body: boxBody });
}

gui.add(
  {
    addBox: () =>
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
      ),
  },
  "addBox"
);

/**
 * Render
 */
const clock = new THREE.Clock();
function render() {
  const delta = clock.getDelta();
  world.step(1 / 60, delta, 3);

  needUpdateObjs.forEach(({ obj, body }) => {
    obj.position.copy(body.position);
    obj.quaternion.copy(body.quaternion);
  });

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
