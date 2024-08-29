import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let storyFocus = false;

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
    if( !storyFocus ) {
      hoverGetPreview();
    }
    
  }

  // clear all titles
  function clearAllPreviews() {
    scene.children.forEach(( child ) => {
      
      if( child.type !== "Line" ) {
        child.children[0].visible = false;
      }
    })
  }

  // function to draw the title
  function drawTitle( item ) {
    clearAllPreviews();

    // show the new one
    item.object.children[0].visible = true;
  }

  // get the top intersecting card
  function getIntersect() {
    // update camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    
    // get only the cards
    const kinder = scene.children.filter(( child ) => child.type !== "Line");
    
    // get the intersects
    const intersects = raycaster.intersectObjects( kinder );
    if( intersects.length > 0 ) {
      return intersects[0];
    }
    return null
  }
  
  function hoverGetPreview() {
    const item = getIntersect();
    
    if( item ) {
      // console.log("the intersects!!", intersects[0]);
      drawTitle( item );
    } else {
      clearAllPreviews();
    }
  }
  
  // add the click function to get the full story card
  function handleClick() {
    // if story isnt focused
    if( !storyFocus ) {
      // get the clicked item
      const item = getIntersect();
      if( item ) {
        // get the data of the object
        const data = item.object.userData;
        
        // get the story title
        const title = document.querySelector( "#story-title");
        title.textContent = data.title;
        
        // get the story body
        const body = document.querySelector( "#story-body");
        body.textContent = data.body;
        
        // get the story card and reveal it
        clearAllPreviews();
        const card = document.querySelector( '#story-card' );
        card.style.display = 'block';
  
        // flip the focus variable
        storyFocus = true;

      }
    } else if ( storyFocus ) {
      const card = document.querySelector( '#story-card' );
      card.style.display = "none";
      storyFocus = false;
    }

  }
  
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('click', handleClick );
}

