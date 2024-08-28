import * as THREE from "three";

export function panIt( camera ) {

  let isPanning = false;
  let panStart = new THREE.Vector2();
  let panEnd = new THREE.Vector2();
  let panDelta = new THREE.Vector2();
  
  function onMouseDown(event) {
      isPanning = true;
      panStart.set(event.clientX, event.clientY);
  }
  
  function onMouseMove(event) {
      if (!isPanning) return;
  
      panEnd.set(event.clientX, event.clientY);
      panDelta.subVectors(panEnd, panStart);
  
      const panSpeed = 0.004; // Adjust for faster/slower panning
  
      const offsetX = -panDelta.x * panSpeed;
      const offsetY = panDelta.y * panSpeed;
  
      camera.position.x += offsetX;
      camera.position.y += offsetY;
  
      // If you want to maintain the same camera target, update it here
      // camera.lookAt( cameraTarget );
  
      panStart.copy(panEnd);
  }
  
  function onMouseUp() {
      isPanning = false;
  }
  
  // Custom zoom function
  function onDocumentMouseWheel( event ) {
    // event.preventDefault();

    // Define zoom sensitivity
    const zoomSensitivity = .01;

    // Move camera along the z-axis
    camera.position.z += event.deltaY * zoomSensitivity;

    // Constrain camera position within limits
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, 0, 10);
  }

  // Add event listener for the mouse wheel
  document.addEventListener('wheel', onDocumentMouseWheel, false);

  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  

}  
