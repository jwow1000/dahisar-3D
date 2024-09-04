import * as THREE from 'three';

export function setControls( controls, camera ) {

  // Disable rotation
  controls.enableRotate = false;

  // Allow panning only on X and Y axes
  controls.enablePan = true;
  // controls.screenSpacePanning = false; // Prevent panning on Z-axis
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

  // prevent z rotation
  controls.addEventListener('change', () => {
    camera.position.z = Math.max(controls.minDistance, Math.min(controls.maxDistance, camera.position.z));
  });

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

  controls.update();

}