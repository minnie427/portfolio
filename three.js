import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/GLTFLoader.js";

// variables for setup
let container;
let camera;
let renderer;
let scene;
let box;
let duck;
let controls;
let intersected;
let isDragging = false;
let mouseDownTime = 0;
const CLICK_TIME_THRESHOLD = 200; // milliseconds

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const models = [
  {
    gltf: "./data/pinkmask.gltf",
    link: "./pages/bodymorphosis.html",
    position: [-1.7, -0.5, 0],
    scale: 0.3,
    rotate: 0.75,
  },
  {
    gltf: "./data/rose1.glb",
    link: "./pages/voice.html",
    position: [0, -0.4, -2.3],
    scale: 25,
  },
  {
    gltf: "./data/microphone.glb",
    link: "./pages/voice.html",
    position: [0, 0, -2.3],
    scale: 5,
  },
  {
    gltf: "./data/cookie.glb",
    link: "./pages/cookie.html",
    position: [2, 1, -2.1],
    scale: 0.01,
  },
  {
    gltf: "./data/record.glb",
    link: "./pages/sound.html",
    position: [-2, 0.2, -2.4],
    scale: 4,
  },
  {
    gltf: "./data/galaxy3.glb" ,
    link: "./pages/purpleisland.html",
    position: [2.1, 0.3, 0],
    scale: 0.5,
  },
  {
    gltf: "./data/cupcake4.glb",
    link: "./pages/cupcake.html",
    position: [0, -0.4, 2],
    scale: 2.1,
  },
  {
    gltf: "./data/abstract.glb",
    link: "./pages/about.html",
    position: [2, -0.7, 2],
    scale: 0.15,
  },
  {
    gltf: "./data/macbook3.glb",
    link: "./pages/contact.html",
    position: [-1.8, -0.3, 2.2],
    scale: 0.26,
  }
];

function onMouseDown(event) {
  mouseDownTime = Date.now();
  isDragging = false;
}

function onMouseMove(event) {
  mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
  
  if (mouseDownTime > 0) {
    isDragging = true;
  }
}

function onMouseUp(event) {
  const clickDuration = Date.now() - mouseDownTime;
  
  if (!isDragging && clickDuration < CLICK_TIME_THRESHOLD) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(modelContainer.children);
    if (intersects.length > 0) {
      const { link } = intersects[0].object.userData;
      location.replace(link, '_blank');
    }
  }
  
  mouseDownTime = 0;
  isDragging = false;
}

container = document.querySelector('.scene');

//create scene
scene = new THREE.Scene();

const modelContainer = new THREE.Group();
scene.add(modelContainer);

const fov = 10;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.2;
const far = 900;

// camera setup
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 40, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

// light
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0,1,0);
scene.add(light);

const sl = new THREE.SpotLight(0xffc0fc0, 500, 10, 0.2, 0.5);
sl.position.set(5,3,0);
scene.add(sl);

//renderer
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

renderer.outputEncoding = THREE.sRGBEncoding;

//load model
let loader = new GLTFLoader();
models.forEach(modelDetails => {
  const { gltf, scale, position, link } = modelDetails;
  loader.load(gltf, ({ scene }) => {
    scene.traverse(child => {
      child.userData.link = link;
    });
    
    modelContainer.add(scene);
    scene.scale.set(scale, scale, scale);
    scene.position.set(...position);
  });
});

function animate() {
  requestAnimationFrame(animate);
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(modelContainer.children);
  if (intersects.length > 0) {
    container.style.cursor = "pointer";
  } else {
    container.style.cursor = "initial";
  }
  
  modelContainer.children.forEach(child => {
    child.rotation.y += 0.007;
  });

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Event listeners
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);

animate();
onWindowResize();