import * as THREE from 'three';
import { OrbitControls, WebGL } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';


// check for webgl 2
if( WebGL.isWebGL2Available() ) {

} else {

}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );

let controls = new OrbitControls( camera, renderer.domElement );
 
// create cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// define story nodes
const story = () => {
  const geo = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
  const mat = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
  const node = new THREE.Mesh( geo, mat );
  scene.add( node );
  
  const rand = {
    x: randFloat( 0, 3 ),
    y: randFloat( 0, 3 ),
    z: randFloat( 0, 3 ),
  }

  node.position.set( rand.x, rand.y, rand.z);
} 

story();

camera.position.z = 5;

// animation loop
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

document.body.appendChild( renderer.domElement );
