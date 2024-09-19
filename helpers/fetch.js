
export function getStories() {
  // get the cms data from the webflow page collections item
  const cmsItems = document.querySelectorAll('.cms-items-3D');
  const divCards = document.querySelectorAll('.class-story-cards');
  
  // Initialize an array to hold all the stories
  const allStories = [];

  // Loop through each script tag and make an object
  cmsItems.forEach( item => {
    // console.log("see it", item );
    const obj = {
      title: item.getAttribute('data-title'),
      body: item.getAttribute('data-body'),
      tags: item.getAttribute('data-tags'),
      links: item.getAttribute('data-links'),
      chapter: item.getAttribute('data-chapter'),
      cutout: item.getAttribute('data-cutout'),
      cardElem: {},
    }

    // get the card DOM element
    divCards.forEach( card => {
      
      const chapterMatch = card.getAttribute( 'link' );
      if( obj.chapter === chapterMatch ) {
        obj.cardElem = card
      }
    });
    
    // add the obj to the allStories array
    allStories.push( obj );

  });
  // console.log("allSrotrries", allStories)
  return allStories
}
