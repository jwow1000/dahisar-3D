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
  
      const panSpeed = 0.002; // Adjust for faster/slower panning
  
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
  
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  

}  
