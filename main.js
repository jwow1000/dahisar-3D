import * as THREE from 'three';
import { OrbitControls, WebGL } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { getStories } from './helpers/fetch';
import { panIt } from './helpers/panning';
import { story, line } from './helpers/customObjects';
import { getHover } from './helpers/rayCaster';


// check for webgl 2
if( WebGL.isWebGL2Available() ) {
  init3D();
} else {
  // maybe a better fallback here?
  console.log("you dont have openGL2");
}

function init3D() {
  // get the stories
  const allStories = getStories();

  ////////////////////// set up
  const viewport = document.querySelector( '[data-3d="c"]' );
  
  // // define scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true
  });

  renderer.setClearColor(0x000000, 0); // 0 is fully transparent
  renderer.setSize( window.innerWidth, window.innerHeight );
  viewport.appendChild( renderer.domElement );
  
  // custom panning
  panIt( camera );

  // start camera position
  camera.position.z = 1;

  
  // create the stories
  allStories.map((item) => {
    story( item, scene );
  });

  // render the labels 
  // Set up the CSS2DRenderer
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  document.body.appendChild(labelRenderer.domElement);

  // create the lines
  scene.children.map((item, idx) => {
    // console.log("check out the lines: ", item)
    if( idx > 0 ) {
      line( item, scene );
    }
  })

  getHover( scene, camera, viewport );

  ////////////////////// render
  // animation loop
  function animate() { 
    // node.rotation.x += 0.01;
    // node.rotation.y += 0.01;
    // if( pointerMoved ) {
    //   renderRaycast();
    //   renderTitle();
    // }
    // controls.update();
    // requestAnimationFrame( animate );
    // camera.position.lerp( targetCameraPos, dampingFactor );
    renderer.render( scene, camera );
    labelRenderer.render(scene, camera);
  }
  
  renderer.setAnimationLoop( animate );
  labelRenderer.render(scene, camera);

}