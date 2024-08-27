import * as THREE from 'three';
import { OrbitControls, WebGL } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';
import { getFirstObject } from './helpers/rayCastHelper';
import { panIt } from './helpers/panning';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';

const texLink = "https://cdn.prod.website-files.com/66c4bc9a1e606660c92d9d24/66cd3c3ab3738ac81d235de7_scribbles.png"

// check for webgl 2
if( WebGL.isWebGL2Available() ) {
  init3D();
} else {
  console.log("oops you dont have opengl2");
}

function init3D() {
  ////////////////////// 
  // get the cms data from the webflow page collections item
  const storyScripts = document.querySelectorAll('.story-item');
  
  // Initialize an array to hold all the stories
  const allStories = [];

  // Loop through each script tag and parse the JSON data
  storyScripts.forEach(script => {
    // console.log("see the json", script.textContent);
    const storyData = JSON.parse(script.textContent);
    allStories.push(storyData);
  });
  ////////////////////// 

  // Now allStories contains all the story data
  // console.log("are these all the stories? : ", allStories);

  // variables
  let storyFocus = false;
  let titlePreview = 0;
  
  // set up
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
  // add orbit controls
  let controls = new OrbitControls( camera, renderer.domElement );
  controls.enableRotate = false;
  controls.enablePan = false;
  // controls.keys = {
  //   LEFT: 'ArrowLeft', //left arrow
  //   UP: 'ArrowUp', // up arrow
  //   RIGHT: 'ArrowRight', // right arrow
  //   BOTTOM: 'ArrowDown' // down arrow
  // }
  
  // // add light (needs work!)
  const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
  dirLight.position.set( 5, 5, 5 );
  scene.add( dirLight ); 
  
  // Raycasting set up
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const red = new THREE.Color(255,0,20);
  let pointerMoved = false;

  // set raycaster options
  raycaster.far = 10;
  raycaster.near = 0;

  function onPointerMove( event ) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    pointerMoved = true;
  }

  function renderRaycast() {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    
    // calculate objects intersecting the picking ray, filter out the lines
    const filtered = scene.children.filter( (object) => {
        return object.type !== "Line";
    })

    const intersects = raycaster.intersectObjects( filtered );
    // console.log("ifjdksal", intersects)
    if( intersects.length > 0 ) {
      // console.log("intererere", intersects[0]);
      // show this objects title on hover
      intersects[0].object.material.color.set( red );
    } else {
      // disable all titles
    }
    pointerMoved = false;
    

  }
  window.addEventListener( 'pointermove', onPointerMove );

  ////////////////////// 
  // define story nodes
  const story = ( item ) => {
    // make the shape
    const geometry = new THREE.PlaneGeometry( 0.5, 0.5 );
    const white = new THREE.Color(1,1,1);
    // image texture
    const texture = new THREE.TextureLoader().load(
      texLink
    );
    const material = new THREE.MeshLambertMaterial({
      // transparent: true,
      // map: texture,
      color: white,
      // side: THREE.DoubleSide,
    });
    const node = new THREE.Mesh( geometry, material );
    // node.geometry.computeBoundingBox();
    scene.add( node );

    const rand = {
      x: randFloat( -3, 3 ),
      y: randFloat( -3, 3 ),
      z: randFloat( -3, 0 ),
    }

    // make the label
    // // make a div element in the document
    const titleDiv = document.createElement( 'div' );
    titleDiv.className = 'label';
    titleDiv.textContent = item.title;
    titleDiv.style.backgroundColor = 'transparent';
    // // make a CSSD object
    const titleLabel = new CSS2DObject( titleDiv );
    titleLabel.position.set( rand.x, rand.y, rand.z );
    titleLabel.center.set( 0, 1 );
    node.add( titleLabel );
    // titleLabel.layers.set( 0 );

    node.position.set( rand.x, rand.y, rand.z);
    
    node.userData = {
      title: item.title,
      body: item.body,
      tags: item.tag,
      chapter: item.chapter,
      links: item.links,
    }
  } 

  // look at the scene?
  console.log("scene?", allStories)
  
  // create the nodes with array.map()
  allStories.map((item) => {
    story( item );
  });

  // define the line function
  function lines( item ) {
    const data = item.userData;
    console.log('data', data)
    if( data.links ) {
      // define the origin
      const originPoint = new THREE.Vector3( 
        item.position.x,
        item.position.y,
        item.position.z,
      );
      
      // define the material
      const white = new THREE.Color(0,0,0);
      const material = new THREE.LineBasicMaterial({color: white})
      // define the points, origin(this items position), end(the connections)
      // get the string and turn into an array
      const links = data.links.replace(/\s/g, '').split(',');
      
      // run through the array
      links.forEach((e) => {
        // get item with chapter name
        const found = scene.children.find((element) => element.userData.chapter === e);
        console.log("e", found)
        if( found ) {
          // define a points array
          const pointsArr = [];
          
          // set the origin point wuth this item's coordinates
          pointsArr.push( originPoint );
          // get found item's coordinates
          pointsArr.push( new THREE.Vector3( 
            found.position.x,
            found.position.y,
            found.position.z,
          ));
          
          // form the line
          const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
          const line = new THREE.Line( geometry, material);
  
          // add to scene
          scene.add( line );

        }

      });
    }
  }
  // create the line nodes
  scene.children.map((item, idx) => {
    // console.log("check ou the lines: ", item)
    if( idx > 0 ) {
      lines(item);
    }
  })

  camera.position.z = 5;
  
  // define on hover
  const handleHover = (event) => {
    // console.log("triggggg?", event);
    // if( !storyFocus ) {
    //   // govern this out put
    //   const select = getFirstObject( event, window, camera, scene );
    //   if( select?.object ) {
    //     const title = select.object.userData.title;
    //     // console.log("title peak", select.object);
    //   }
    // }
  }

  //// define handleClick event function
  const handleClick = (event) => {
    if( storyFocus === false ) {
      const select = getFirstObject( event, window, camera, scene );
      if( select ) {
        const data = select.object.userData;
        // storyObject = select;
        // make card appear
        const card = document.querySelector( '#story-card' );
        card.style.display = "block";
        // change the title text
        const t = document.querySelector( "#story-title");
        t.textContent = data.title; 
        // change the body text
        const b = document.querySelector( "#story-body");
        b.textContent = data.body;
        // toggle state
        storyFocus = true;
      }
    } else if ( storyFocus === true ) {
      const card = document.querySelector( '#story-card' );
      card.style.display = "none";
      storyFocus = false;
    }

    // 
  }
  // console.log("wth", storyFocus)
  document.addEventListener('click', handleClick);
  // document.onpointermove = handleHover ;
  // document.addEventListener('onpointermove', handleHover);
  
  
  // animation loop
  function animate() { 
    // node.rotation.x += 0.01;
    // node.rotation.y += 0.01;
    if( pointerMoved ) {
      renderRaycast();
    }
    renderer.render( scene, camera );
  }
  
  renderer.setAnimationLoop( animate );

}

