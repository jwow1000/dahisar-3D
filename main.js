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

async function init3D() {
  // get the story data
  const allStories = await getStories();
  // console.log("check story data", allStories);
  const animateGo = {
    value: true
  };
  
  // Set up the CSS2DRenderer
  const labelRenderer = new CSS2DRenderer();
  
  // for dev purposes get the story card and prview element in webfloe and make them dissapear
  const webflowStory = document.getElementById("story-template");
  const webflowPreview = document.getElementById("preview-template");
  webflowPreview.style.display = "none"
  webflowStory.style.display = "none"

  // // get the loading screen and make it dissapear once the sketch is loaded
  // const loadingScreen = document.getElementById('loading-screen');
  // we need to listen to the material renderering here too, becasue of all the pngs.
  // // function to hide
  // function hideLoadingScreen() {
  //   loadingScreen.style.display = 'none';
  // }

  // define scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true
  });
  // Create a clock for global animation
  const clock = new THREE.Clock();

  renderer.setClearColor(0x000000, 0); // 0 is fully transparent
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  
  // const viewport = document.querySelector(['data-id="3Js-canvas"'])
  const viewport = document.querySelector('.three-js-canvas');
  viewport.appendChild( renderer.domElement );
  
  // orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  
  // customize the Orbit Controls
  setControls( controls, camera );
  
  // create the stories, labels, lines
  allStories.map((item, idx) => {
    story( item, scene, idx );
  })
        
  
  // create the lines
  scene.children.map((item, idx) => {
    
    if( idx > 0 ) {
      line( item, scene );
    }
  })
  console.log("rendering lines...", scene)

  // render the labels 
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.pointerEvents = 'none'; // Ensures that labels don't interfere with mouse events
  viewport.appendChild( labelRenderer.domElement );
  
  // raycaster
  getHover( scene, camera, animateGo );
  
  // animation loop
  function animate() { 
    
    requestAnimationFrame( animate );

    renderer.render( scene, camera);
    
    // console.log("animate status: ", animateGo)
    // get elapsed time
    if( animateGo.value === true ) {

      const elapsedTime = clock.getElapsedTime();
      // pan camera
      const LFO = Math.sin( elapsedTime * 0.001 ) ;
      const animateTime = elapsedTime * LFO;
      const sine =  Math.sin( animateTime ) * 0.001;
      const cos = Math.cos( animateTime ) * 0.001;
      camera.position.x +=  sine * 5;
      controls.target.x += sine * 5;
      camera.position.y +=  cos * 5;
      controls.target.y += cos * 5;
    }


    // render the CSS labelsq
    labelRenderer.render(scene, camera);
    
    // render the 3d scene
    // renderer.render( scene, camera );
    
    // update the damping camera movement
    controls.update(); 
    
  }

  animate();
  
  // renderer.setAnimationLoop( animate );
  // hideLoadingScreen();

}