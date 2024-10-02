import { randInt } from "three/src/math/MathUtils.js";
import { Color } from "three";

export function randomColor() {
  // random r - g - b
  const rgbRand = randInt(0, 2);

  // the selection is the highest
  const r = randInt(0, (rgbRand === 0) ? 255 : 90 ) / 255;
  const g = randInt(0, (rgbRand === 1) ? 255 : 90 ) / 255;
  const b = randInt(0, (rgbRand === 2) ? 255 : 90 ) / 255;

  return new Color(r,g,b )
}

export function getRandStream(min, max) {
  // Create an array with all numbers in the range
  let numbers = [];
  for (let i = min; i <= max; i++) {
      numbers.push(i);
  }

  // Shuffle the array using Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}


// get random position but no repeats in a grid
// the width (in world units) of the preview elements are 2X2 squares
// divide world into something more like 5x5x5 cubes
export function randStreamPosition( stream, idx ) {
  const obj = {};
  
  const zMod = 

  obj.x = ((stream[idx] % 5) * 4) - 10;        
  obj.y = (Math.floor( (stream[idx] % 25 / 5 ) ) * 4) - 10;
  obj.z = (Math.floor( (stream[idx] / 25) ) * 4) - 10;

  return obj;
}