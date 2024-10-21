import GUI from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

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
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
  45,
  storeData.canvasSize.width / storeData.canvasSize.height,
  0.1,
  100,
);
camera.position.set(1, 1.5, 4);
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
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

/**
 * Load Gltf Model
 */
const customUniforms = {
  uTime: {value: 0},
};
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

depthMaterial.onBeforeCompile = (shader) => {
  console.log("depthMaterial onBeforeCompile");
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>", `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
      }
    `,
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>", `
      // test
      #include <begin_vertex>

      float angle = sin(position.y * 2. + uTime) * 0.5;
      mat2 rotateMatrix = get2dRotateMatrix(angle);
      transformed.xz *= rotateMatrix;
    `,
  );
};

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/resources/model/fox/fox_material_added.gltf",
  (gltf) => {
    const foxHead = gltf.scene.children[0];
    console.log("foxHead", foxHead);

    foxHead.castShadow = true;
    foxHead.receiveShadow = true;
    foxHead.scale.set(0.5, 0.5, 0.5);
    foxHead.position.y = 0.4;
    // foxHead.rotation.z = Math.PI * 0.25;

    // get gltf model material
    const material = foxHead.material;

    material.onBeforeCompile = (shader) => {
      console.log("material onBeforeCompile");
      shader.uniforms.uTime = customUniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>", `
          #include <common>

          uniform float uTime;

          mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
          }
        `,
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>", `
        #include <beginnormal_vertex>

        float angle = sin(position.y * 2. + uTime) * 0.5;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        objectNormal.xz *= rotateMatrix;
        `,
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>", `
          #include <begin_vertex>

          // float angle = sin(position.y * 2. + uTime) * 0.5;
          // mat2 rotateMatrix = get2dRotateMatrix(angle);
          transformed.xz *= rotateMatrix;
        `,
      );
    };


    // foxHead.material = depthMaterial;
    foxHead.customDepthMaterial = depthMaterial;

    scene.add(foxHead);
  },
);

/**
 * Geometry
 */
// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);

/**
 * Render
 */
const clock = new THREE.Clock();

function render() {
  const elapsedTime = clock.getElapsedTime();

  customUniforms.uTime.value = elapsedTime;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
