import * as THREE from 'three';

export function setControls( controls, camera ) {

  // Disable rotation
  controls.enableRotate = false;

  // Allow panning only on X and Y axes
  controls.enablePan = true;
  controls.screenSpacePanning = true; // Prevent panning on Z-axis
  controls.maxPolarAngle = Math.PI / 2; // Lock vertical rotation
  
  // Zoom settings
  controls.enableZoom = true; // Allow zooming
  controls.zoomSpeed = 2.0; // Adjust zoom speed

  // Optional: Set min/max distances to control how far the camera can zoom
  controls.minDistance = 1; // Minimum zoom distance
  controls.maxDistance = 10; // Maximum zoom distance

  // Damping (smooth movement)
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // update mouse and touch controls
  // Remap left mouse button to pan
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN // Optionally, allow right-click to pan as well
  };

  // Remap single finger touch to pan
  controls.touches = {
    ONE: THREE.TOUCH.PAN, // Use single finger to pan
    TWO: THREE.TOUCH.DOLLY_PAN // Two-finger for zoom and pan
  };

  // start camera position
  camera.position.z = 6;

  // add event listener to clamp panning
  controls.addEventListener( 'change', e => {
    const x = controls.target.x;
    const y = controls.target.y;

    if( x < -10 || x > 10 ) {
      controls.target.setX( x < -10 ? -10 : 10 );
      camera.position.setX( x < -10 ? -10 : 10 );
    } else if(  y < -10 || y > 10 ) {
      controls.target.setY( y < -10 ? -10 : 10 );
      camera.position.setY( y < -10 ? -10 : 10 );
    }

  })

  controls.update();

}