import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';

const blau = new THREE.Color("rgb(25,255,255,0.1)");
const white = new THREE.Color("rgb(255,255,255)");


export const story = ( item, scene ) => {
  console.log("stroury item", item)
  // make the shape
  const geometry = new THREE.PlaneGeometry( 0.5, 0.5 );
  
  // image texture
  const texture = new THREE.TextureLoader().load(
    item.cutout
  );
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: texture,
  });
  const node = new THREE.Mesh( geometry, material );
  
  scene.add( node );

  const rand = {
    x: randFloat( -6, 6 ),
    y: randFloat( -6, 6 ),
    z: randFloat( -6, 0 ),
  }

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

  // get the string and turn into an array
  if( item.tags ) {
    
    const tags = item.tags.replace(/\s/g, '').split(',');
    tags.forEach(( tag ) => {
      console.log("is tags working?");
      // maybe have to make these links
      const div = document.createElement('div');
      div.className = 'story-tag'
      div.textContent = tag;
      tagsDiv.appendChild( div );
    }); 

  }

  labelDiv.appendChild( titleDiv );
  labelDiv.appendChild( tagsDiv );
  console.log( "check the label div", labelDiv);
  
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
  }
} 

// create lines
export const line = ( item, scene ) => {
  const data = item.userData;
    // console.log('data', data)
    if( data.links ) {
      
      // define the origin
      const originPoint = new THREE.Vector3( 
        item.position.x,
        item.position.y,
        item.position.z,
      );

      // define the material
      const material = new THREE.LineBasicMaterial({
        color: blau, 
        opacity: 0.5,
        transparent: true,
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
          pointsArr.push( originPoint );
          
          // pointsArr.push( parentPoint );

          // get found item's coordinates
          pointsArr.push( new THREE.Vector3( 
            found.position.x,
            found.position.y,
            found.position.z,
          ));
          
          // form the line
          const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
          const newLine = new THREE.Line( geometry, material);
          
          newLine.translateX( newLine.position.x - item.position.x);
          newLine.translateY( newLine.position.y - item.position.y);
          newLine.translateZ( newLine.position.z - item.position.z);

          // add to node?
          item.add( newLine );
          console.log( "familia", item.children); 
          
          // add to scene
          // scene.add( line );

        }

      });
    }
}