import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module";
import { color } from "three/webgpu";

/**
 * Init scene
 */
const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let scene, renderer;
function initScene() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.setSize(canvasSize.width, canvasSize.height);
  renderer.setClearColor(0x232637);
  document.body.appendChild(renderer.domElement);
}

/**
 * Loading Manager
 */
function loadingResources() {
  initLoadManager();
  loadDoorTexture();
  loadBricksTexture();
  loadGrassTexture();
}

let loadingManager;
function initLoadManager() {
  loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("Loading started");
  };
  loadingManager.onLoad = () => {
    console.log("Loading finished");
  };
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(
      "Loading => ",
      Math.floor((itemsLoaded / itemsTotal) * 100) + "%"
    );
  };
}

/**
 * Load Door Texture
 */
const doorTextureData = {
  color: null,
  alpha: null,
  ambientOcclusion: null,
  height: null,
  normal: null,
  metalness: null,
  roughness: null,
};
function loadDoorTexture() {
  const doorTextureLoader = new THREE.TextureLoader(loadingManager);
  doorTextureData.color = doorTextureLoader.load(
    "/resources/texture/door/color.jpg"
  );
  doorTextureData.alpha = doorTextureLoader.load(
    "/resources/texture/door/alpha.jpg"
  );
  doorTextureData.ambientOcclusion = doorTextureLoader.load(
    "/resources/texture/door/ambientOcclusion.jpg"
  );
  doorTextureData.height = doorTextureLoader.load(
    "/resources/texture/door/height.jpg"
  );
  doorTextureData.normal = doorTextureLoader.load(
    "/resources/texture/door/normal.jpg"
  );
  doorTextureData.metalness = doorTextureLoader.load(
    "/resources/texture/door/metalness.jpg"
  );
  doorTextureData.roughness = doorTextureLoader.load(
    "/resources/texture/door/roughness.jpg"
  );
}

/**
 * Load grass texture
 */
const grassTextureData = {
  color: null,
  normal: null,
  roughness: null,
  ambientOcclusion: null,
};
function loadGrassTexture() {
  const grassTextureLoader = new THREE.TextureLoader(loadingManager);
  grassTextureData.color = grassTextureLoader.load(
    "/resources/texture/grass/color.jpg"
  );
  grassTextureData.normal = grassTextureLoader.load(
    "/resources/texture/grass/normal.jpg"
  );
  grassTextureData.roughness = grassTextureLoader.load(
    "/resources/texture/grass/roughness.jpg"
  );
  grassTextureData.ambientOcclusion = grassTextureLoader.load(
    "/resources/texture/grass/ambientOcclusion.jpg"
  );
  // set repeat
  grassTextureData.color.wrapS = THREE.RepeatWrapping;
  grassTextureData.color.wrapT = THREE.RepeatWrapping;
  grassTextureData.normal.wrapS = THREE.RepeatWrapping;
  grassTextureData.normal.wrapT = THREE.RepeatWrapping;
  grassTextureData.roughness.wrapS = THREE.RepeatWrapping;
  grassTextureData.roughness.wrapT = THREE.RepeatWrapping;
  grassTextureData.ambientOcclusion.wrapS = THREE.RepeatWrapping;
  grassTextureData.ambientOcclusion.wrapT = THREE.RepeatWrapping;
  // set repeat count
  grassTextureData.color.repeat.set(8, 8);
  grassTextureData.normal.repeat.set(8, 8);
  grassTextureData.roughness.repeat.set(8, 8);
  grassTextureData.ambientOcclusion.repeat.set(8, 8);
}

/**
 * Load bricks texture
 */
const bricksTextureData = {
  color: null,
  normal: null,
  roughness: null,
  ambientOcclusion: null,
};
function loadBricksTexture() {
  const bricksTextureLoader = new THREE.TextureLoader(loadingManager);
  bricksTextureData.color = bricksTextureLoader.load(
    "/resources/texture/bricks/color.jpg"
  );
  bricksTextureData.normal = bricksTextureLoader.load(
    "/resources/texture/bricks/normal.jpg"
  );
  bricksTextureData.roughness = bricksTextureLoader.load(
    "/resources/texture/bricks/roughness.jpg"
  );
  bricksTextureData.ambientOcclusion = bricksTextureLoader.load(
    "/resources/texture/bricks/ambientOcclusion.jpg"
  );
}

/**
 * Debug GUI
 */
let stats, gui, envriomentDebug, lightDebug;
function initDebug() {
  stats = new Stats();
  document.body.appendChild(stats.dom);
  gui = new GUI();
  envriomentDebug = gui.addFolder("Environment");
  lightDebug = gui.addFolder("Light");
}

const dataStore = {
  house: {
    base: {
      color: 0xac8e82,
    },
    roof: {
      color: 0x885522,
    },
  },
  light: {
    directionalLight: {
      lightHelper: false,
      shadowCameraHelper: false,
    },
    doorLight: {
      lightHelper: false,
    },
  },
  fogVisible: true,
};

/**
 * Camera
 */
let camera;

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.z = 10;
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  const cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);
}

/**
 * Controls
 */
let controls;
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

/**
 * Light
 */
function initLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.01);
  directionalLight.position.set(20, 20, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.type = THREE.PCFSoftShadowMap;
  directionalLight.shadow.camera.near = 20;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );
  directionalLightHelper.visible = dataStore.light.directionalLight.lightHelper;
  scene.add(directionalLightHelper);

  const shadowCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );
  shadowCameraHelper.visible =
    dataStore.light.directionalLight.shadowCameraHelper;
  scene.add(shadowCameraHelper);

  lightDebug
    .add(dataStore.light.directionalLight, "lightHelper")
    .name("Directional Light Helper")
    .onChange(() => {
      directionalLightHelper.visible =
        dataStore.light.directionalLight.lightHelper;
    });
  lightDebug
    .add(dataStore.light.directionalLight, "shadowCameraHelper")
    .name("Shadow Camera Helper")
    .onChange(() => {
      shadowCameraHelper.visible =
        dataStore.light.directionalLight.shadowCameraHelper;
    });
}

/**
 * Plane
 */
function initPlane() {
  const planeGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: grassTextureData.color,
    normalMap: grassTextureData.normal,
    roughnessMap: grassTextureData.roughness,
    aoMap: grassTextureData.ambientOcclusion,
  });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(planeMesh.geometry.attributes.uv.array, 2)
  );
  planeMesh.rotation.x = -Math.PI * 0.5;
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);
}

/**
 * House Group
 */
let house;
function createHouse() {
  house = new THREE.Group();
  scene.add(house);
  createHoseBase();
  createHoseRoof();
  createHouseDoor();
  createHouseBush();
}

/**
 * House Base
 */
function createHoseBase() {
  const houseBaseGeometry = new THREE.BoxGeometry(4, 2.5, 4);
  const houseBaseMaterial = new THREE.MeshStandardMaterial({
    map: bricksTextureData.color,
    normalMap: bricksTextureData.normal,
    roughnessMap: bricksTextureData.roughness,
    aoMap: bricksTextureData.ambientOcclusion,
  });
  const houseBaseMesh = new THREE.Mesh(houseBaseGeometry, houseBaseMaterial);
  houseBaseMesh.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(
      houseBaseMesh.geometry.attributes.uv.array,
      2
    )
  );
  houseBaseMesh.position.y = 1.25;
  houseBaseMesh.castShadow = true;
  house.add(houseBaseMesh);
}

/**
 * House Roof
 */
function createHoseRoof() {
  const houseRoofGeometry = new THREE.ConeGeometry(3.5, 2, 4);
  const houseRoofMaterial = new THREE.MeshStandardMaterial({
    color: dataStore.house.roof.color,
    metalness: 0.3,
    roughness: 0.8,
  });
  const houseRoofMesh = new THREE.Mesh(houseRoofGeometry, houseRoofMaterial);
  houseRoofMesh.position.y = 3.25;
  houseRoofMesh.rotation.y = Math.PI * 0.25;
  houseRoofMesh.castShadow = true;
  house.add(houseRoofMesh);
}

/**
 * House Door
 */
function createHouseDoor() {
  const houseDoorGeometry = new THREE.BoxGeometry(1.7, 2, 0.1);
  const houseDoorMaterial = new THREE.MeshStandardMaterial({
    map: doorTextureData.color,
    transparent: true,
    alphaMap: doorTextureData.alpha,
    aoMap: doorTextureData.ambientOcclusion,
    displacementMap: doorTextureData.height,
    displacementScale: 0.1,
    normalMap: doorTextureData.normal,
    metalnessMap: doorTextureData.metalness,
    roughnessMap: doorTextureData.roughness,
  });
  const houseDoorMesh = new THREE.Mesh(houseDoorGeometry, houseDoorMaterial);
  houseDoorMesh.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(
      houseDoorMesh.geometry.attributes.uv.array,
      2
    )
  );
  houseDoorMesh.position.y = 0.9;
  houseDoorMesh.position.z = 1.951;
  house.add(houseDoorMesh);
  createHouseDoorLight();
}

/**
 * Door Light
 */
function createHouseDoorLight() {
  const doorLight = new THREE.PointLight(0xff7d46, 2, 7, 1);
  doorLight.position.set(0, 2.2, 2.2);
  doorLight.castShadow = true;
  house.add(doorLight);

  const doorLightHelper = new THREE.PointLightHelper(doorLight);
  doorLightHelper.visible = dataStore.light.doorLight.lightHelper;
  house.add(doorLightHelper);

  lightDebug
    .add(dataStore.light.doorLight, "lightHelper")
    .name("Door Light Helper")
    .onChange(() => {
      doorLightHelper.visible = dataStore.light.doorLight.lightHelper;
    });
}

/**
 * House bush
 */
function createHouseBush() {
  const houseBushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const houseBushMaterial = new THREE.MeshStandardMaterial({
    color: 0x33cc00,
    metalness: 0.3,
    roughness: 0.8,
  });
  const rightBigHouseBushMesh = new THREE.Mesh(
    houseBushGeometry,
    houseBushMaterial
  );
  rightBigHouseBushMesh.castShadow = true;
  rightBigHouseBushMesh.position.set(1.2, 0.25, 2.6);
  house.add(rightBigHouseBushMesh);
  const rightSmallHouseBushMesh = new THREE.Mesh(
    houseBushGeometry,
    houseBushMaterial
  );
  rightSmallHouseBushMesh.castShadow = true;
  rightSmallHouseBushMesh.position.set(1.7, 0.1, 2.6);
  rightSmallHouseBushMesh.scale.set(0.5, 0.5, 0.5);
  house.add(rightSmallHouseBushMesh);
  const leftBigHouseBushMesh = new THREE.Mesh(
    houseBushGeometry,
    houseBushMaterial
  );
  leftBigHouseBushMesh.castShadow = true;
  leftBigHouseBushMesh.position.set(-1.2, 0.15, 2.6);
  leftBigHouseBushMesh.scale.set(1.2, 1.2, 1.2);
  house.add(leftBigHouseBushMesh);
}

/**
 * Graves Group
 */
function createGraves() {
  const graves = new THREE.Group();
  scene.add(graves);

  /**
   * Grave add
   */
  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.3,
    roughness: 0.8,
  });
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const graveMesh = new THREE.Mesh(graveGeometry, graveMaterial);
    graveMesh.position.set(x, 0.4, z);
    graveMesh.rotation.y = (Math.random() - 0.5) * 0.4;
    graveMesh.rotation.z = (Math.random() - 0.5) * 0.3;
    graveMesh.castShadow = true;
    graves.add(graveMesh);
  }

  /* House Debug */
  const houseDebug = gui.addFolder("House");
  houseDebug
    .addColor(dataStore.house.base, "color")
    .name("House Base Color")
    .onChange(() => {
      houseBaseMaterial.color.set(dataStore.house.base.color);
    });
  houseDebug
    .addColor(dataStore.house.roof, "color")
    .name("House Roof Color")
    .onChange(() => {
      houseRoofMaterial.color.set(dataStore.house.roof.color);
    });
}

/**
 * Ghost
 */
let ghost1, ghost2, ghost3;
function createGhost() {
  ghost1 = new THREE.PointLight(0xff00ff, 2, 3);
  ghost1.castShadow = true;
  scene.add(ghost1);
  ghost2 = new THREE.PointLight(0x00ffff, 2, 3);
  ghost2.castShadow = true;
  scene.add(ghost2);
  ghost3 = new THREE.PointLight(0xffff00, 2, 3);
  ghost3.castShadow = true;
  scene.add(ghost3);
}

/**
 * Fog
 */
function addFog() {
  const fog = new THREE.Fog(0x232637, 5, 8);
  scene.fog = dataStore.fogVisible ? fog : null;
  envriomentDebug
    .add(dataStore, "fogVisible")
    .name("Fog Visible")
    .onChange(() => {
      scene.fog = dataStore.fogVisible ? fog : null;
    });
}

/**
 * init all
 */
function init() {
  initScene();
  loadingResources();
  initDebug();
  initCamera();
  initControls();
  initLight();
  initPlane();
  createHouse();
  createGraves();
  createGhost();
  addFog();
}

/**
 * Renderer loop
 */
const clock = new THREE.Clock();
function render() {
  /* Ghost Move */
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.3;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.7;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y = Math.sin(elapsedTime * 2) + Math.sin(elapsedTime * 3.5);

  stats.update();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();
render();
