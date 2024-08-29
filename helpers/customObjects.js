import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import { randFloat } from 'three/src/math/MathUtils.js';

const blau = new THREE.Color("rgb(25,255,255,0.1)");

export const story = ( item, scene ) => {
  // make the shape
  const geometry = new THREE.PlaneGeometry( 0.5, 0.5 );
  // image texture
  // const texture = new THREE.TextureLoader().load(
  //   texLink
  // );
  const material = new THREE.MeshLambertMaterial({
    // transparent: true,
    // map: texture,
    // color: white,
    // side: THREE.DoubleSide,
  });
  const node = new THREE.Mesh( geometry, material );
  // node.geometry.computeBoundingBox();
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
      const material = new THREE.LineBasicMaterial({color: blau})
      
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
          
          // set the origin point wuth this item's coordinates
          pointsArr.push( originPoint );
          
          // get found item's coordinates
          pointsArr.push( new THREE.Vector3( 
            found.position.x,
            found.position.y,
            found.position.z,
          ));
          
          // form the line
          const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
          const line = new THREE.Line( geometry, material);
  
          // add to scene
          scene.add( line );

        }

      });
    }
}