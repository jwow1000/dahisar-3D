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

  const wheelList = intersections;

  if (typeof wheelList[0] !== "undefined") {
    return wheelList[0];
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

  let intersections = raycaster.intersectObjects(scene.children, true);

  return intersections;
}

// export function getObjects( objectList ) {
//   const storyObjects = [];

//   objectList.forEach((object) => {
//     console.log( "object", object.userData )
//     const objectData = object.userData || "Untitled Object";
//     objectData.includes(title) ? wheelObjects.push(object.userData) : null;
//   });

//   return storyObjects;
// }
