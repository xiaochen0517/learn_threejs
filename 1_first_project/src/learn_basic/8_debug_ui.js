import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug UI
 */
const gui = new GUI({
  title: "调试面板",
  width: 500,
});
const debugObject = {};

const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Geometry
 */
debugObject.cubeColor = 0x009900;
debugObject.cubeSubdivision = 2;
debugObject.cube = {
  width: 1,
  height: 1,
  depth: 1,
};
const geometry = new THREE.BoxGeometry(
  debugObject.cube.width,
  debugObject.cube.height,
  debugObject.cube.depth,
  debugObject.cubeSubdivision,
  debugObject.cubeSubdivision,
  debugObject.cubeSubdivision
);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.cubeColor,
  wireframe: false,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const recreateCube = () => {
  const geometry = new THREE.BoxGeometry(
    debugObject.cube.width,
    debugObject.cube.height,
    debugObject.cube.depth,
    debugObject.cubeSubdivision,
    debugObject.cubeSubdivision,
    debugObject.cubeSubdivision
  );
  cube.geometry.dispose();
  cube.geometry = geometry;
};

const debugCubeFolder = gui.addFolder("Cube");

debugCubeFolder
  .add(debugObject.cube, "width")
  .min(0)
  .max(2)
  .step(0.01)
  .name("cube width")
  .onChange(recreateCube);
debugCubeFolder
  .add(debugObject.cube, "height")
  .min(0)
  .max(2)
  .step(0.01)
  .name("cube height")
  .onChange(recreateCube);
debugCubeFolder
  .add(debugObject.cube, "depth")
  .min(0)
  .max(2)
  .step(0.01)
  .name("cube depth")
  .onChange(recreateCube);

debugCubeFolder
  .add(cube.position, "x")
  .min(-2)
  .max(2)
  .step(0.01)
  .name("cube x position");
debugCubeFolder.add(cube, "visible").name("cube visible");
debugCubeFolder.add(cube.material, "wireframe").name("cube wireframe");
debugCubeFolder
  .addColor(debugObject, "cubeColor")
  .name("cube color")
  .onChange((value) => {
    cube.material.color.set(debugObject.cubeColor);
  });

debugObject.spin = () => {
  gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 });
};
debugCubeFolder.add(debugObject, "spin").name("spin cube");

debugObject.cubeSubdivision = 2;
debugCubeFolder
  .add(debugObject, "cubeSubdivision")
  .min(1)
  .max(20)
  .step(1)
  .name("cube subdivision")
  .onChange(recreateCube);

/**
 * add axis helper
 */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  45,
  canvasSize.width / canvasSize.height,
  0.1,
  1000
);
camera.position.z = 3;
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

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

/**
 * Full screen
 */
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const render = function () {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
