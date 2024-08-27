import * as THREE from "three";

export function getFirstObject( event, window, camera, scene ) {
  const raycaster = new THREE.Raycaster();
  const getFirstValue = true;

  const mousePointer = getMouseVector2(event, window);
  const intersections = checkRayIntersections(
    mousePointer,
    camera,
    raycaster,
    scene,
    getFirstValue
  );

  const intersectList = [];
  
  console.log("look at the intersections: ", intersections[0].object.userData)

  intersections.forEach( (intersect) => {
    console.log("for eacj", intersect)
    if( intersect.object.type !== 'Line'  ) {
      intersectList.push( intersect );
    }
    
  });
  
  console.log("interesectionssss", intersectList)
  
  console.log(":ljkgfd", intersectList);
  
  if (typeof intersectList[0] !== "undefined") {
    return intersectList[0];
  }

  return null;
}

export function getMouseVector2(event, window) {
  let mousePointer = new THREE.Vector2();

  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  return mousePointer;
}

export function checkRayIntersections(mousePointer, camera, raycaster, scene) {
  raycaster.setFromCamera(mousePointer, camera);

  const cards = getObjects( scene.children );

  console.log("carsdsd", cards);

  let intersections = raycaster.intersectObjects( cards, true);

  console.log("Intersections:", intersections); // Debug log

  return intersections;
}

export function getObjects( objectList ) {
  const storyObjects = [];

  objectList.forEach((object) => {
    storyObjects.push( object );
    // if( object.userData.title ) {
    //   storyObjects.push( object );
    // }
  });
  // console.log( "object", storyObjects)

  return storyObjects;
}
