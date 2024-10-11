import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";

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
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(canvasSize.width, canvasSize.height);
document.body.appendChild(renderer.domElement);

/**
 * Matcap material
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/resources/texture/matcaps/8.png");

/**
 * Font loader
 */
const letters = "mas0n1ee";

const fontLoader = new FontLoader();
fontLoader.load(
  "/resources/fonts/harmonyos_sans_black_regular.json",
  (font) => {
    const textGeometry = new TextGeometry(letters, {
      font: font,
      size: 0.7,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 2,
    });
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -textGeometry.boundingBox.max.x / 2,
    //   -textGeometry.boundingBox.max.y / 2,
    //   -textGeometry.boundingBox.max.z / 2
    // );
    textGeometry.center();

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);

    // create separate geometry for each letter
    const letterGeometryList = [];
    for (const letter of letters) {
      const letterGeometry = new TextGeometry(letter, {
        font: font,
        size: 0.4,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 2,
      });
      letterGeometry.center();
      letterGeometryList.push(letterGeometry);
    }

    // create meth use randomize position
    for (let meshIndex = 0; meshIndex < 400; meshIndex++) {
      const letterIndex = Math.floor(Math.random() * letters.length);
      const letterGeometry = letterGeometryList[letterIndex];
      const textMesh = new THREE.Mesh(letterGeometry, material);
      textMesh.position.x = (Math.random() - 0.5) * 10;
      textMesh.position.y = (Math.random() - 0.5) * 10;
      textMesh.position.z = (Math.random() - 0.5) * 10;
      textMesh.rotation.x = Math.random() * Math.PI;
      textMesh.rotation.y = Math.random() * Math.PI;
      const scale = Math.random() * 0.7 + 0.3;
      textMesh.scale.set(scale, scale, scale);
      scene.add(textMesh);
    }
  }
);

/**
 * Geometry
 */

// const material = new THREE.MeshBasicMaterial();

// Sphere geometry
// const sphereGeometry = new THREE.SphereGeometry(0.3, 100, 100);
// const sphereMesh = new THREE.Mesh(sphereGeometry, material);

// scene.add(sphereMesh);

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
camera.position.z = 5;
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
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const render = function () {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
