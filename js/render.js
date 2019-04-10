// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
// scene.fog = new THREE.FogExp2( 0xcccccc, 0.0002 );

// camera
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 60, 50, 60 );

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.id = 'canvas';

// right click to pin, but not during right click and drag
// https://stackoverflow.com/a/45098107/3125070
renderer.domElement.addEventListener('mousedown', (e) => {
	if(e.button === 2)  // if right clicked
		renderer.domElement.addEventListener('mousemove', rightClickAndDragged);
});

const preventClick = (e) => {
	e.preventDefault();
	e.stopImmediatePropagation();
};

renderer.domElement.addEventListener('mouseup', e => {
	if(e.button === 2) {
		if(isRightClickAndDragged) e.target.addEventListener('contextmenu', preventClick);
		else {
			e.target.removeEventListener('contextmenu', preventClick);
			pinObject();
		}
		isRightClickAndDragged = false;
		renderer.domElement.removeEventListener('mousemove', rightClickAndDragged);
	}
});

document.body.appendChild( renderer.domElement );

// controls
// controls = new THREE.MapControls( camera, renderer.domElement );
let controls = new THREE.OrbitControls( camera, renderer.domElement );

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 50;
controls.maxDistance = 2000;
controls.maxPolarAngle = Math.PI / 2;

// // world
// var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
// geometry.translate( 0, 0.5, 0 );
// var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

// ground
const ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
ground.name = 'ground';
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );

// grid
const grid = new THREE.GridHelper( 20000, 200, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );

// axis helper
const axesHelper = new THREE.AxesHelper( 5 );
axesHelper.name = 'axesHelper';
scene.add( axesHelper );

// lights
const directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 1, 1, 1 );
scene.add( directionalLight );

const ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

// load from folder once car model is loaded
const folderLocation = '/data';
const filename = 'slice5';
const extension = 'nvm';
function loadModel() { loadFile(folderLocation + '/' + filename + '.' + extension); }

// car
let car = null;
const manager = new THREE.LoadingManager( loadModel );
const loader = new THREE.OBJLoader( manager );
loader.load( 'assets/car.obj', obj => car = obj );

// animation variables
let xAnimate = 0;
let yAnimate = 0;
let zAnimate = 0;
let shouldAnimate = false;

// animate
function animate() {

	if(shouldAnimate) {
		const timer = Date.now() * 0.0001;
		camera.position.x = Math.cos( timer ) * 80;
		camera.position.z = Math.sin( timer ) * 80;
		camera.lookAt( xAnimate, 0, zAnimate );
	}

	// restrict camera movement below 10
	// console.log(camera.position)
	if ( camera.position.y < 1 ) camera.position.y = 1;

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	update();

}

animate();
