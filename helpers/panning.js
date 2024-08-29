import * as THREE from "three";

export function panIt( camera, viewport ) {

  let isPanning = false;
  let panStart = new THREE.Vector2();
  let panEnd = new THREE.Vector2();
  let panDelta = new THREE.Vector2();
  let initialTouchDistance = null;
  
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

  function onTouchStart(event) {
    if (event.touches.length === 1) {
      isPanning = true;
      panStart.set(event.touches[0].clientX, event.touches[0].clientY);
    } else if (event.touches.length === 2) {
      isPanning = false;
      initialTouchDistance = getTouchDistance(event);
    }
  }
  
  function onTouchMove(event) {
    if (isPanning && event.touches.length === 1) {
      panEnd.set(event.touches[0].clientX, event.touches[0].clientY);
      panDelta.subVectors(panEnd, panStart);

      const panSpeed = 0.004; // Adjust for faster/slower panning

      const offsetX = -panDelta.x * panSpeed;
      const offsetY = panDelta.y * panSpeed;

      camera.position.x += offsetX;
      camera.position.y += offsetY;

      panStart.copy(panEnd);
    } else if (event.touches.length === 2 && initialTouchDistance !== null) {
      const currentTouchDistance = getTouchDistance(event);
      const zoomFactor = (initialTouchDistance - currentTouchDistance) * 0.01;
      
      camera.position.z += zoomFactor;
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, 0, 10);

      initialTouchDistance = currentTouchDistance;
    }
  }

  function onTouchEnd() {
    isPanning = false;
    initialTouchDistance = null;
  }

  function getTouchDistance(event) {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
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

  function getTouchDistance(event) {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Add event listener for the mouse events
  document.addEventListener('wheel', onDocumentMouseWheel, false);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
 
  // add event listeners for touch events (mobile + tablet)
  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);

  


}  
