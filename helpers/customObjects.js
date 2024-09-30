import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';
import { randomColor, randStreamPosition, getRandStream } from './random.js';

const blau = new THREE.Color("rgb(25,255,255,0.1)");
const white = new THREE.Color("rgb(255,255,255)");
const defaultImg = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/66eca12c7d639e4980f73ce3_3.2i_Cutout.png';
const theStream = getRandStream(0, 124);


export const story = ( item, scene, idx ) => {
  // make the shape
  const geometry = new THREE.PlaneGeometry( 2, 2 );
  
  // image texture
  const texture = new THREE.TextureLoader().load(
    item.cutout ? item.cutout : defaultImg
  );
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: texture,
  });
  const node = new THREE.Mesh( geometry, material );
  
  scene.add( node );
  // random positon genrator no overlap
  const rand = randStreamPosition( theStream, idx);
  
  // Create a 2D label
  const labelDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const tagsDiv = document.createElement('div');

  // label container data
  labelDiv.className = 'story-container-preview';
  
  // title data
  titleDiv.className = 'story-title-preview';
  titleDiv.textContent = item.title;
  
  // tag data
  tagsDiv.className = 'story-tags-container';

  // if thre's tags get them
  if( item.tags ) {
    
    // get the string and turn into an array
    const tags = item.tags.replace(/\s/g, '').split(',');
    
    tags.forEach(( tag ) => {
      // maybe have to make these links
      const div = document.createElement('div');
      div.className = 'story-tag'
      div.textContent = tag;
      tagsDiv.appendChild( div );
    }); 

  }

  // append to the div
  labelDiv.appendChild( titleDiv );
  labelDiv.appendChild( tagsDiv );
  
  // create the CSS object
  const label = new CSS2DObject( labelDiv );
  label.position.set(0, 0, 0); // Position the label below the plane
  
  // // style the label
  // const styleMe = label.element.style;
  // styleMe.backgroundColor = "rgb(120,120,120)";
  label.visible = false;

  node.add( label );

  node.position.set( rand.x, rand.y, rand.z);
  
  node.userData = {
    title: item.title,
    body: item.body,
    tags: item.tags,
    chapter: item.chapter,
    links: item.links,
    showTitle: false,
    slug: item.slug,
    cardElem: item.cardElem,
  }

} 

// create lines
export const line = ( item, scene ) => {
  const data = item.userData;
    if( data.links ) {
      
      // define the origin
      const originPoint = new THREE.Vector3( 
        item.position.x,
        item.position.y,
        item.position.z,
      );

      // define the material
      // get a random color
      const randoRGB = randomColor(); 
      console.log("uggh", randoRGB)
      const material = new LineMaterial({
        color: randoRGB, 
        // opacity: 0.5,
        linewidth: 2,
        // transparent: true,
      })
      
      // define the points, origin(this items position), end(the connections)
      // get the string and turn into an array
      const links = data.links.replace(/\s/g, '').split(',');
      
      // run through the array
      links.forEach((e) => {
        // get item with chapter name
        const found = scene.children.find((element) => element.userData.chapter === e);
        // console.log("e", found)
        
        if( found ) {
          // define a points array
          const pointsArr = [];
          
          // set the origin point with this item's coordinates
          pointsArr.push( ...originPoint );
          
          // get found item's coordinates
          pointsArr.push( 
              found.position.x,
              found.position.y,
              found.position.z,
          
          );
          
          // form the line
          const geometry = new LineGeometry();
          geometry.setPositions( pointsArr );
          // const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
          const newLine = new Line2( geometry, material );
          
          newLine.translateX( newLine.position.x - item.position.x);
          newLine.translateY( newLine.position.y - item.position.y);
          newLine.translateZ( newLine.position.z - item.position.z);

          // add to node
          item.add( newLine );
        
        }

      });
    }
}