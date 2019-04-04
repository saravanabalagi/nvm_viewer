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
renderer.domElement.addEventListener('contextmenu', pinObject);
document.body.appendChild( renderer.domElement );

// controls
// controls = new THREE.MapControls( camera, renderer.domElement );
controls = new THREE.OrbitControls( camera, renderer.domElement );

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
var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
ground.name = 'ground';
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );

// grid
var grid = new THREE.GridHelper( 20000, 200, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );

// axis helper
var axesHelper = new THREE.AxesHelper( 5 );
axesHelper.name = 'axesHelper';
scene.add( axesHelper );

// lights
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1, 1, 1 );
scene.add( light );

var light = new THREE.AmbientLight( 0x222222 );
scene.add( light );

// load from folder once car model is loaded
const folderLocation = 'http://localhost:8000/data';
const filename = 'slice5.nvm';
function loadModel() { loadFile(folderLocation + '/' + filename); }

// car
var car = null;
var manager = new THREE.LoadingManager( loadModel );
var loader = new THREE.OBJLoader( manager );
loader.load( 'js/car.obj', obj => car = obj );

// animation varibales
var xAnimate = 0;
var yAnimate = 0;
var zAnimate = 0;
var shouldAnimate = false;

// animate
function animate() {

	if(shouldAnimate) {
		var timer = Date.now() * 0.0001;
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
