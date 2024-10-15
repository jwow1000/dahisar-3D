import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { randomColor, randStreamPosition, getRandStream } from "./random.js";
import { grayscaleShader } from "./shaders.js";

const blau = new THREE.Color("rgb(25,255,255,0.1)");
const white = new THREE.Color("#FFFFFF");
const defaultImg =
  "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/66eca12c7d639e4980f73ce3_3.2i_Cutout.png";
const theStream = getRandStream(0, 127);

export const story = (item, scene, idx) => {
  // make the geometry for new story
  const geometry = new THREE.PlaneGeometry(2, 2);

  // make the shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_texture: { value: null }, // Texture to be assigned per element
      u_grayScale: { value: 1.0 }, // 1.0 for grayscale, 0.0 for full color
      u_brightness: { value: 1 }, // turn up brightness
      u_saturation: { value: 1 },
      u_contrast: { value: 1 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D u_texture;
      uniform float u_grayScale;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(u_texture, vUv);
    
        // Apply brightness (use a smaller value to prevent over-brightening)
        vec3 finalColor = color.rgb + vec3(0.2);  // Small increment for brightness
        
        // Apply contrast
        finalColor = (finalColor - 0.5) * 1.3 + 0.5;  // Adjust contrast
        
        // Ensure the final color values are within the [0.0, 1.0] range
        finalColor = clamp(finalColor, 0.0, 1.0);  // Prevent values from exceeding
        
        // Grayscale effect
        float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));  // Use proper luminance values
        gray = max(gray, 0.05);  // Ensure grayscale doesn't drop below a minimum value
        vec3 grayscaleColor = vec3(gray);

        // Blend between grayscale and full color
        gl_FragColor = vec4(mix(grayscaleColor, finalColor, u_grayScale), color.a);
      }
 
    `,
    transparent: true, // Allow for transparency
  });

  // const material = new THREE.MeshBasicMaterial({
  //   transparent: true,
  // });

  // make the node
  const node = new THREE.Mesh(geometry, material);
  node.visible = false;

  // image texture
  const loader = new THREE.TextureLoader();

  // load the texture async
  loader.load(
    item.cutout ? item.cutout : defaultImg,
    (texture) => {
      // declare color mode
      texture.colorSpace = THREE.SRGBColorSpace;

      if (texture.image) {
        // Get the image dimensions from the texture
        const imageWidth = texture.image.width;
        const imageHeight = texture.image.height;
        const aspectRatio = imageWidth / imageHeight;
        const desiredHeight = 2;
        const desiredWidth = desiredHeight * aspectRatio;

        // Replace the geometry with the new size
        node.geometry.dispose(); // Dispose of the old geometry
        node.geometry = new THREE.PlaneGeometry(desiredWidth, desiredHeight);

        geometry.verticesNeedUpdate = true;

        // Apply the texture to the shader material
        material.uniforms.u_texture.value = texture;
        material.uniforms.u_grayScale.value = 0;
        material.needsUpdate = true; // Ensure material updates after texture is applied

        node.visible = true;
      }
    },
    undefined,
    function (error) {
      console.error("An error occurred loading the texture", error);
    }
  );

  // add the story to the scene
  scene.add(node);

  // random positon genrator no overlap
  const rand = randStreamPosition(theStream[idx]);
  console.log("random position: ", rand);

  // Create a 2D label
  const labelDiv = document.createElement("div");
  const titleDiv = document.createElement("div");
  const tagsDiv = document.createElement("div");

  // label container data
  labelDiv.className = "preview-card";

  // title data
  titleDiv.className = "preview-title";
  titleDiv.textContent = item.title;

  // tag data
  tagsDiv.className = "preview-tags-cont";

  // if thre's tags get them
  if (item.tags) {
    // get the string and turn into an array
    const tags = item.tags.replace(/\s/g, "").split(",");

    tags.forEach((tag) => {
      // maybe have to make these links
      const div = document.createElement("div");
      div.className = "preview-tag";
      div.textContent = tag;
      tagsDiv.appendChild(div);
    });
  }

  // append to the div
  labelDiv.appendChild(titleDiv);
  labelDiv.appendChild(tagsDiv);

  // create the CSS object
  const label = new CSS2DObject(labelDiv);
  label.position.set(-2, -0.5, 0); // Position the label below the plane

  // // style the label
  // const styleMe = label.element.style;
  // styleMe.backgroundColor = "rgb(120,120,120)";
  label.visible = false;

  node.add(label);

  node.position.set(rand.x, rand.y, rand.z);

  node.userData = {
    title: item.title,
    body: item.body,
    tags: item.tags,
    chapter: item.chapter,
    links: item.links,
    showTitle: false,
    slug: item.slug,
    cardElem: item.cardElem,
  };
};

// create lines
export const line = (item, scene) => {
  const data = item.userData;
  
  if (data.links) {
    // define the origin
    const originPoint = new THREE.Vector3(
      item.position.x,
      item.position.y,
      item.position.z
    );

    // define the material
    const materialSolid = new THREE.LineBasicMaterial({
      color: white,
      opacity: 0.3,
      transparent: true,
    });

    const materialDashed = new THREE.LineDashedMaterial({
      color: white,
      opacity: 0.3,
      dashSize: 0.1,
      gapSize: 0.1,
      linewidth: 0.5,
      transparent: true,
    });

    // define the points, origin(this items position), end(the connections)
    // get the string and turn into an array
    const links = data.links.split(",").map(link => link.trim()); // Trim any extra spaces

    // create an array of objects
    const formattedLinks = links.map(link => {
      const isThin = /thin/.test(link);                 // Check if 'thin' is present
      const chapterLink = link.replace(/\s?thin/, "");  // Remove 'thin' if it's present
      return { chapterLink, thin: isThin };             // Return an object with both fields
    });

    // run through the array
    formattedLinks.forEach((e) => {
      
      // get item with chapter name
      const found = scene.children.find(
        (element) => element.userData.chapter === e.chapterLink
      );

      if (found) {
        // define a points array
        // Define the points array with the origin and found item's coordinates
        const pointsArr = [originPoint, new THREE.Vector3(found.position.x, found.position.y, found.position.z)];

        // form the line
        // Create the geometry and add the points
        const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
        
        // dashed line or not?
        const varMaterial = e.thin ? materialDashed : materialSolid;
        
        // make the line
        const newLine = new THREE.Line(geometry, varMaterial);
        
        // If using a dashed line, compute the line distances
        if (e.thin) {
          newLine.computeLineDistances();
        } 

        newLine.translateX(newLine.position.x - item.position.x);
        newLine.translateY(newLine.position.y - item.position.y);
        newLine.translateZ(newLine.position.z - item.position.z);
        console.log("new lines: ", newLine)
        // add to node
        item.add( newLine );
      }
    });
  }
};


