import * as THREE from 'three';
import { OrbitControls, WebGL } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { getStories } from './helpers/fetch';
import { story, line } from './helpers/customObjects';
import { setControls } from './helpers/controlsSetup';
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
  // console.log("all storiees", allStories)

  // get the loading screen and make it dissapear once the sketch is loaded
  const loadingScreen = document.getElementById('loading-screen');
  // function to hide
  function hideLoadingScreen() {
    loadingScreen.style.display = 'none';
  }

  // define scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true
  });

  renderer.setClearColor(0x000000, 0); // 0 is fully transparent
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  
  // const viewport = document.querySelector(['data-id="3Js-canvas"'])
  const viewport = document.getElementById('three-js-canvas');
  viewport.appendChild( renderer.domElement );
  
  // custom panning
  // panIt( camera, viewport );
  
  // orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  
  // customize the Orbit Controls
  setControls( controls, camera );
  
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
  labelRenderer.domElement.style.pointerEvents = 'none'; // Ensures that labels don't interfere with mouse events
  viewport.appendChild( labelRenderer.domElement );

  // create the lines
  scene.children.map((item, idx) => {
    // console.log("check out the lines: ", item)
    if( idx > 0 ) {
      line( item, scene );
    }
  })

  getHover( scene, camera );

  // animation loop
  function animate() { 
    
    // render the CSS labels
    labelRenderer.render(scene, camera);
    
    // render the 3d scene
    renderer.render( scene, camera );
    
    // update the damping camera movement
    controls.update(); 
    
  }
  
  hideLoadingScreen();
  renderer.setAnimationLoop( animate );

}