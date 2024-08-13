import * as THREE from 'three';
import { OrbitControls, WebGL } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';

// import data array hopefully from webflow

// check for webgl 2
if( WebGL.isWebGL2Available() ) {
  init3D();
} else {
  console.log("oops you dont have opengl2");
}

function init3D() {
  // set up
  const viewport = document.querySelector( '[data-3d="c"]' );
  // console.log( "hmm", viewport );
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setSize( window.innerWidth, window.innerHeight );
  viewport.appendChild( renderer.domElement );
  
  let controls = new OrbitControls( camera, renderer.domElement );
  
  

  const readTxt = async() => {
    let url ="https://uploads-ssl.webflow.com/667da4ba702f74a7e038db4d/66ba289cc65fcb380d59e9bc_He%20comes%20from%20this%20alley%3B%20he%20goes%20from%20that%20alley.txt";
    let response = await fetch (url);
    const txt = await response.text().then(( str ) => {
        // return str.split('\r');    // return the string after splitting it.
        return str;
    });
    console.log( "retrieved story: ", txt );
  }
  readTxt();
  
  // define story nodes
  const story = () => {
    const geo = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const mat = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
    const node = new THREE.Mesh( geo, mat );
    scene.add( node );
    
    const rand = {
      x: randFloat( -3, 3 ),
      y: randFloat( -3, 3 ),
      z: randFloat( -3, 3 ),
    }
  
    node.position.set( rand.x, rand.y, rand.z);
  } 
  
  // create the nodes
  for( let i=0; i < 40; i++) {
    story();
  
  }
  
  camera.position.z = 5;
  
  // animation loop
  function animate() {
    // node.rotation.x += 0.01;
    // node.rotation.y += 0.01;
    renderer.render( scene, camera );
  }
  
  renderer.setAnimationLoop( animate );
}

// document.body.appendChild( renderer.domElement );
