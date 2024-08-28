export function getStories() {
  // get the cms data from the webflow page collections item
  const storyScripts = document.querySelectorAll('.story-item');
  
  // Initialize an array to hold all the stories
  const allStories = [];

  // Loop through each script tag and parse the JSON data
  storyScripts.forEach(script => {
    // console.log("see the json", script.textContent);
    const storyData = JSON.parse(script.textContent);
    allStories.push(storyData);
  });

  return allStories
}

