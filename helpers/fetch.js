// export function getStories() {
//   // get the cms data from the webflow page collections item
//   const storyScripts = document.querySelectorAll('.story-item');
//   console.log("storyScruiptts", storyScripts)
//   // Initialize an array to hold all the stories
//   const allStories = [];

//   // Loop through each script tag and parse the JSON data
//   storyScripts.forEach(script => {
//     console.log("see the json", script.textContent);
//     const storyData = JSON.parse(script.textContent);
//     allStories.push(storyData);
//   });

//   return allStories
// }


export function getStories() {
  // get the cms data from the webflow page collections item
  const cmsItems = document.querySelectorAll('.cms-body-text');
  console.log("storyScruiptts", cmsItems)
  
  // Initialize an array to hold all the stories
  const allStories = [];

  // Loop through each script tag and make an object
  cmsItems.forEach( item => {
    console.log("see the json", item );
    const obj = {
      title: item.getAttribute('data-title'),
      body: item.getAttribute('data-body'),
      tags: item.getAttribute('data-tags'),
      links: item.getAttribute('data-links'),
      chapter: item.getAttribute('data-chapter'),
      cutout: item.getAttribute('data-cutout'),
    }
    
    // add the obj to the allStories array
    allStories.push( obj );

  });

  return allStories
}
