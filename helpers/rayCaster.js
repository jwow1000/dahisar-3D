import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let lastTitle = {};

// raycaster options
raycaster.far = 20;


// Create a 2D label
const labelDiv = document.createElement('div');

export function getHover( scene, camera, canvas ) {

  function onPointerMove( event ) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
  
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    // get intersection if pointer moves
    intersection();
    
  }

  // clear all titles
  function clearAll() {
    scene.children.forEach(( child ) => {
      
      if( child.type !== "Line" ) {
        child.children[0].visible = false;
      }
    })
  }

  // function to draw the title
  function drawTitle( item ) {
    clearAll();

    // show the new one
    item.object.children[0].visible = true;
  }
  
  function intersection() {
    // update camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    
    // get only the cards
    const kinder = scene.children.filter(( child ) => child.type !== "Line");
    
    // get the intersects
    const intersects = raycaster.intersectObjects( kinder );
    if( intersects.length > 0 ) {
      // console.log("the intersects!!", intersects[0]);
      drawTitle( intersects[0] );
    } else {
      clearAll();
    }
  }
  
  document.addEventListener('mousemove', onPointerMove);
}

