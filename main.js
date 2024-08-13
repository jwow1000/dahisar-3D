import * as THREE from 'three';
import { OrbitControls, WebGL } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';
import storyList from "./assets/story-index.json";
import { getFirstObject } from './helpers/rayCastHelper';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
// console.log(storyList)
// import data array hopefully from webflow

// check for webgl 2
if( WebGL.isWebGL2Available() ) {
  init3D();
} else {
  console.log("oops you dont have opengl2");
}

function init3D() {
  // variables
  let storyFocus = false;
  let storyObject = {
    title: "",
    body: "",
    links: [],
  }

  
  // set up
  const viewport = document.querySelector( '[data-3d="c"]' );
  
  // // define scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setSize( window.innerWidth, window.innerHeight );
  viewport.appendChild( renderer.domElement );
  
  // // // add css2d renderer
  // const labelRenderer = new CSS2DRenderer();
  // labelRenderer.setSize( window.innerWidth, window.innerHeight );
  // labelRenderer.domElement.style.position = 'absolute';
  // labelRenderer.domElement.style.top = '0px';
  // document.body.appendChild( labelRenderer.domElement );

  // // add orbit controls
  let controls = new OrbitControls( camera, renderer.domElement );
  
  // // add light (needs work!)
  const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
  dirLight.position.set( 5, 5, 5 );
  scene.add( dirLight );

  
  
  

  // const readTxt = async() => {
  //   let url ="https://uploads-ssl.webflow.com/667da4ba702f74a7e038db4d/66ba289cc65fcb380d59e9bc_He%20comes%20from%20this%20alley%3B%20he%20goes%20from%20that%20alley.txt";
  //   let response = await fetch (url);
  //   const txt = await response.text().then(( str ) => {
  //       // return str.split('\r');    // return the string after splitting it.
  //       return str;
  //   });
  //   console.log( "retrieved story: ", txt );
  // }
  // readTxt();
  
  // define story nodes
  const story = ( item ) => {
    // make the shape
    const geo = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const mat = new THREE.MeshBasicMaterial( { color: 0x0002fff } );
    const matRed = new THREE.MeshBasicMaterial( { color: 0xDC } );
    const node = new THREE.Mesh( geo, mat );
    scene.add( node );

    const rand = {
      x: randFloat( -3, 3 ),
      y: randFloat( -3, 3 ),
      z: randFloat( -3, 3 ),
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
      links: [],
    }

    
  } 
  
  // create the nodes with array.map()
  storyList.stories.map((item) => {
    story( item );
  });
  
  camera.position.z = 5;
  
  // console.log("see inside", scene)

  // add onClick
  // // add the card element function
  // const handleCard = () => {
  //   console.log( 'handle card')
  //   
  // }
  //// define handleClick event function
  const handleClick = (event) => {
    if( storyFocus === false ) {
      const select = getFirstObject( event, window, camera, scene );
      if( select ) {
        const data = select.object.userData;
        // storyObject = select;
        // make card appear
        const card = document.querySelector( '#story-card' );
        card.style.zIndex = 100;
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
      card.style.zIndex = -100;
      storyFocus = false;
    }

    // 
  }
  console.log("wth", storyFocus)
  document.addEventListener('click', handleClick)
  

  // animation loop
  function animate() { 
    // node.rotation.x += 0.01;
    // node.rotation.y += 0.01;
    renderer.render( scene, camera );
  }
  
  renderer.setAnimationLoop( animate );

}

// document.body.appendChild( renderer.domElement );
