import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let storyFocus = false;
let currentStory = {};

// raycaster options
raycaster.far = 20;


export function getHover( scene, camera ) {

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
      // clear the preview
      if( child.type !== "Line" ) {
        child.children[0].visible = false;
      } 
      // return opacity back to 70%
      child.children.forEach((item, idx) => {
        if( idx > 0 ) {
          item.material.opacity = 0.5;
        }
      });

    })
  }

  // function to draw the title
  function drawTitle( item ) {
    clearAllPreviews();

    // show the new one
    if( item.object.children[0] ) {
      item.object.children[0].visible = true;
    }
  }

  // get the top intersecting card
  function getIntersect() {
    // update camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    
    // get the intersects
    const intersects = raycaster.intersectObjects( scene.children );
    
    // filter out everything but the plane nodes
    const filtered = intersects.filter((child) => {
      // the lines or the background don't have faces so filter this way
      if( child.face ) {
        return child;
      }
    });
    
    if( filtered.length > 0 ) {
      return filtered[0];
    }
    return null
  }
  
  function hoverGetPreview() {
    const item = getIntersect();
    
    if( item ) {
      drawTitle( item );

      // hilight line connections
      item.object.children.forEach((child, idx) => {
        
        // make full opaque, 1
        if( idx !== 0 ) {
          child.material.opacity = 1;
          
        }

      });

    } else {
      clearAllPreviews();
    }
  }
  
  // // add the click function to get the full story card
  // function handleClick() {
  //   // if story isnt focused
  //   if( !storyFocus ) {
  //     // get the clicked item
  //     const item = getIntersect();
  //     if( item ) {
  //       // get the data of the object
  //       const data = item.object.userData;
        
  //       // get the story title
  //       const title = document.querySelector( ".story-card-title");
  //       title.textContent = data.title;
        
  //       // get the story body
  //       const body = document.querySelector( ".story-card-body");
  //       body.textContent = data.body;
        
  //       // get the story card and reveal it
  //       clearAllPreviews();
  //       const card = document.querySelector( '#story-card' );
  //       card.style.display = 'block';
  
  //       // flip the focus variable
  //       storyFocus = true;

  //     }
  //   } else if ( storyFocus ) {
  //     const card = document.querySelector( '#story-card' );
  //     card.style.display = "none";
  //     storyFocus = false;
  //   }

  // }

  // add the click function to show the webflow card
  function handleClick() {
    // if story isnt focused
    if( !storyFocus ) {
      // just to be sure mute former focused card
      if( currentStory.object ) {
        currentStory.object.style.display = "none";
      }

      // get the clicked item
      const item = getIntersect();
      if( item ) {
        // get the data of the object
        const data = item.object.userData;
        
        // get the story card and reveal it
        clearAllPreviews();
        console.log("data: ", data)
        const card = data.cardElem; 
        card.style.display = 'block';
  
        // flip the focus variable
        storyFocus = true;
        currentStory = card;
        console.log("current story: ", currentStory)

      }
    } else if ( storyFocus ) {
      currentStory.style.display = "none";
      storyFocus = false;
    }
  }
  
  
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('click', handleClick );
}

