import * as THREE from "three";
import { gsap } from "gsap";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let storyFocus = false;
let currentStory = {};
let isDragging = false;
let startX = 0; 
let startY = 0;

// raycaster options
raycaster.far = 30;


export function getHover( scene, camera, animateGo ) {
  
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
      
      // return all to gray
      gsap.to( child.material.uniforms.u_grayScale, { value: 0.0, duration: 1 } );

      // return opacity back to 70%
      child.children.forEach((item, idx) => {
        if( idx > 0 ) {
          item.material.linewidth = 2;
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
      // stop animation
      animateGo.value = false;

      drawTitle( item );
      
      // make item color
      
      gsap.to( item.object.material.uniforms.u_grayScale, { value: 1.0, duration: 1.5 } );

      // hilight line connections
      item.object.children.forEach((child, idx) => {
        
        // make full opaque, 1
        if( idx !== 0 ) {
          child.material.linewidth = 6;
        }

      });

    } else  {
      clearAllPreviews();
      // re-start animation
      animateGo.value = true;
    }
  }
  
  // function to update slug URL
  function updateURL( storySlug ) {
    const newURL = `${window.location.pathname}?story=${storySlug}`;
    window.history.pushState( { story: storySlug }, '', newURL);
  } 

  function clearSlug() {
    const path = window.location.pathname;
    window.history.pushState( '','', path);
    // console.log("pather", path)
  }


  // open a story function
  function openStory( item ) {
    // get the data of the object
    const data = item.userData;
    
    // update the url without reload
    updateURL( data.slug );

    // get the story card and reveal it
    clearAllPreviews();
    const card = data.cardElem; 
    card.style.display = 'flex';

    // flip the focus variable
    storyFocus = true;
    currentStory = card;
    // console.log("current story: ", currentStory)
  }

  function closeStory() {
    clearSlug();
    currentStory.style.display = "none";
    storyFocus = false;
  }


  // add the click function to show the webflow card
  function handleClick() {
    // if story isnt focused
    if( !storyFocus  ) {
      // just to be sure mute former focused card
      if( currentStory.object ) {
        currentStory.object.style.display = "none";
      }
      
      animateGo.value = false;

      // get the clicked item
      const item = getIntersect();
      
      if( item ) {
        openStory( item.object );
      }

    } else if ( storyFocus ) {
      closeStory();
      
    }
  }
  
  
  document.addEventListener('mousemove', onPointerMove);

  document.addEventListener("mousedown", ( event ) => {
    isDragging = false;
    // set the origin point
    startX = event.clientX;
    startY = event.clientY;
  });
  
  // Listen for the mousemove to determine a drag
  document.addEventListener('mousemove', ( event ) => {
    const diffX = Math.abs( event.clientX - startX );
    const diffY = Math.abs( event.clientY - startY );
    const dragThresh = 5;
  
    if( diffX > dragThresh || diffY > dragThresh ) {
      isDragging = true;
    }
  
  });
  
  // listen for mouseup
  document.addEventListener('mouseup', ( event ) => {
    if( isDragging ) {
      isDragging = false;
    } else {
      handleClick();
    }
  });
  
  // Optionally listen for mouseleave to reset when the cursor leaves the document
  document.addEventListener('mouseout', () => {
    
    if ( isDragging ) {
      isDragging = false;
    }
    
    // also deactivate the hover effects
    clearAllPreviews();
  });

  // find node by slug
  function findNode( slug ) {
    const nodes = scene.children;
    return nodes.find( node => node.userData.slug === slug);
  }

  // listen for popstate
  window.addEventListener( 'popstate', ( event ) => {
    const storySlug = event.state ? event.state.story : null;
   
    if( storySlug ) {
      // get story by slug
      const found = findNode( storySlug );
      openStory( found )
    } else {
      closeStory();
    }
  }) 

  // get story param function
  function getStoryFromURL() {
    const urlParams = new URLSearchParams( window.location.search );
    const storySlug = urlParams.get('story');
    return storySlug;
  }
  
  // check to see if there are story params on load
  const storySlug = getStoryFromURL();
  if( storySlug ) {
    // get story by slug
    const found = findNode( storySlug );
    openStory( found )
  }
  
}

