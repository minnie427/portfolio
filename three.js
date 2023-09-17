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



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const models = [
  {
    gltf: "./data/robin.glb",
    link: "./pages/pinkbird.html",
    position: [-2.1, 0.3, 0],
    scale: 0.0021,
    rotate: 0.75,
  },
 /*  {
    gltf: "./data/rose1.glb",
    link: "./pages/spring.html",
    position: [0, -0.5, 0],
    scale: 25,
  }, */
  {
    gltf: "./data/rose1.glb",
    link: "./pages/flashlight.html",
    position: [0, -0.4, -2.3],
    scale: 25,
  },
  {
    gltf: "./data/cookie.glb",
    link: "./pages/cookie.html",
    position: [2, 1, -2.1],
    scale: 0.01,
  },
  {
    gltf: "./data/cube.glb",
    link: "./pages/sound.html",
    position: [-2, 0.4, -2],
    scale: 0.008,
  },
  {
    gltf: "./data/galaxy3.glb" ,
    link: "./pages/galaxy.html",
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

]


function onMouseMove( event ) {
	mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;
}

container = document.querySelector('.scene');

//create scene
scene = new THREE.Scene();

const modelContainer = new THREE.Group();
scene.add(modelContainer);

const fov = 10;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 900;

// camera setup
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 40, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);


const light = new THREE.DirectionalLight(0xffffff, 0.4);
light.position.set(10,10,10);
scene.add(light);


//renderer
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);
controls = new OrbitControls (camera, renderer.domElement);
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



/* loader.load( "/models/good_bush.glb", 
    function ( gltf ) {
        gltf.scene.position.set(0, -1.5, -2);
        const model = gltf.scene.children[6];
        model.children[0].material.metalness = 0;
        model.children[1].material.metalness = 0;
        scene.add(model);
    }
); */

function animate(){
  requestAnimationFrame(animate);
  
	raycaster.setFromCamera( mouse, camera );
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

function onMouseClick() {
  raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects(modelContainer.children);
  if (intersects.length > 0) {
    const { link } = intersects[0].object.userData;
    location.replace (link, '_blank');
  }
}

function onWindowResize () {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove, false);

window.addEventListener('click', onMouseClick, false);

animate();
onWindowResize();




/* function setup() {
 
  setupText();
}

function setupText() {
  let loader = new THREE.FontLoader();
  
  loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/helvetiker_regular.typeface.json", function (font) {
    let message = "#CodePenOrebro";
    let geometry = new THREE.TextGeometry(message, {
      font: font,
      size: 500,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 3,
      bevelSegments: 5
    });
    let material = new THREE.MeshPhongMaterial({ 
      color: 0xff00ff, 
      overdraw: 0.5,
      shininess: 70
    });
    geometry.center();
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
} */
/* 
const loader = new THREE.FontLoader();
const textMesh = new THREE.Mesh();
const createTypo = font => {
  const word = "floating";
  const typoProperties = {
    font: font,
    size: cubeSize,
    height: cubeSize / 2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 6,
    bevelOffset: 1,
    bevelSegments: 8
  };
  const text = new THREE.TextGeometry(word, typoProperties);
  textMesh.geometry = text;
  textMesh.material = material;
  textMesh.position.x = cubeSize * -2;
  textMesh.position.z = cubeSize * -1;
  scene.add(textMesh);
};
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  createTypo
);

function loadFont() {
  var loader = new THREE.FontLoader();
  loader.load(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/gentilis_regular.typeface.json",
    function(res) {
      createText(res);
    }
  ); */

/*   var render = function() {
    requestAnimationFrame(render);
    animate();
  };
  loadFont();
  
  render();
function createText(font) {
  textGeo = new THREE.TextGeometry("Iz", {
    font: font,
    size: 40,
    height: 5,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1.8,
    bevelOffset: 0,
    bevelSegments: 5,
    bevelEnabled: true
  });
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();
  text = new THREE.Mesh(textGeo, cubeMat);
  text.position.x = -textGeo.boundingBox.max.x / 2;
  text.castShadow = true;
  scene.add(text);
}
 */

