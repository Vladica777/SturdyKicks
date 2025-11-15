//laivstivan

let counter = 0;
const counterElement = document.querySelector('.badge.badge-pill.bg-danger');

var elementToHide = document.getElementById("ToHide");

function updateVisibility() {
  if (counter === 0) {
    elementToHide.style.display = "none";
  } else {
    elementToHide.style.display = "inline-block";
  }
}
updateVisibility();

function incrementCounter() {
  counter++;
  updateCounter();
}

function updateCounter() {
  counterElement.innerText = counter;
  updateVisibility();
}

for (let i = 1; i <= 16; i++) {
  var link = document.getElementById("button" + i);
  link.addEventListener("click", function(event) {
    event.preventDefault();
    incrementCounter();
  });

  
}

//const searchInput = document.getElementById('searchInput');
//const searchButton = document.getElementById('searchButton');
//const searchResults = document.getElementById('searchResults');

// Add an event listener to the search button
//searchButton.addEventListener('click', function() {
  // Get the search query from the input field
 // const query = searchInput.value;

  // Simulate a search by displaying the query as the search result
  //searchResults.textContent = `Search results for: ${query}`;
//});


//Branza

document.addEventListener('DOMContentLoaded', function() {
  const trendingCategories = document.querySelectorAll('.trending .category');
  const trendingCards = document.querySelectorAll('.trending .preview .card');
  const defaultThing = document.getElementById('defaultState');
  const airForceRow = document.getElementById('air-force-row');
  const airJordan1Row = document.getElementById('air-jordan-1-row');
  const airJordan4Row = document.getElementById('air-jordan-4-row');
  const dunksRow = document.getElementById('dunks-row');

  trendingCategories.forEach(function(category) {
    category.addEventListener('click', function() {
      const selectedCategory = this.dataset.model;

      // Show or hide the specific rows based on the selected category
      if (selectedCategory === 'air-force') {
        airForceRow.style.display = 'flex';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'none';
        dunksRow.style.display = 'none';
        defaultThing.style.display = 'none';
      } else if (selectedCategory === 'air-jordan') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'flex';
        airJordan4Row.style.display = 'none';
        dunksRow.style.display = 'none';
        defaultThing.style.display = 'none';
      } else if (selectedCategory === 'air-jordan-4') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'flex';
        dunksRow.style.display = 'none';
        defaultThing.style.display = 'none';
      } else if (selectedCategory === 'dunks') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'none';
        dunksRow.style.display = 'flex';
        defaultThing.style.display = 'none';
      } else if (selectedCategory === 'others') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'none';
        dunksRow.style.display = 'none';
        defaultThing.style.display = 'flex';
      } 

      
    });
  });

  // Fresh Kicks This Year section
  const freshCards = document.querySelectorAll('.preview .card');
  const airForceModels = document.querySelectorAll('.air-force-model');
  const airJordan1Models = document.querySelectorAll('.air-jordan-1-model');
  const airJordan4Models = document.querySelectorAll('.air-jordan-4-model'); // Added Air Jordan 4 models
  const dunksModels = document.querySelectorAll('.dunks-model'); // Added Dunks models

  freshCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const cardTitle = card.querySelector('.card-title').textContent;

      if (cardTitle === 'Air Force 1 Models') {
        airForceRow.style.display = 'flex';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'none'; // Hide Air Jordan 4 row
        dunksRow.style.display = 'none'; // Hide Dunks row
        preview.style.display = 'none';
      } else if (cardTitle === 'Air Jordan 1 Models') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'flex';
        airJordan4Row.style.display = 'none'; // Hide Air Jordan 4 row
        dunksRow.style.display = 'none'; // Hide Dunks row
        preview.style.display = 'none';
      } else if (cardTitle === 'Air Jordan 4 Models') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'flex';
        dunksRow.style.display = 'none'; // Hide Dunks row
        preview.style.display = 'none';
      } else if (cardTitle === 'Dunks Models') {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'none';
        dunksRow.style.display = 'flex';
        preview.style.display = 'none';
      } else {
        airForceRow.style.display = 'none';
        airJordan1Row.style.display = 'none';
        airJordan4Row.style.display = 'none';
        dunksRow.style.display = 'none';
        
      }

      airForceModels.forEach(function(model) {
        const modelTitle = model.querySelector('.card-title').textContent;

        if (modelTitle.includes('Air Force 1 Model')) {
          model.style.display = 'flex';
        } else {
          model.style.display = 'none';
        }
      });

      airJordan1Models.forEach(function(model) {
        const modelTitle = model.querySelector('.card-title').textContent;

        if (modelTitle.includes('Air Jordan 1 Model')) {
          model.style.display = 'flex';
        } else {
          model.style.display = 'none';
        }
      });

      airJordan4Models.forEach(function(model) {
        const modelTitle = model.querySelector('.card-title').textContent;

        if (modelTitle.includes('Air Jordan 4 Model')) {
          model.style.display = 'flex';
        } else {
          model.style.display = 'none';
        }
      });

      dunksModels.forEach(function(model) {
        const modelTitle = model.querySelector('.card-title').textContent;

        if (modelTitle.includes('Dunks Model')) {
          model.style.display = 'flex';
        } else {
          model.style.display = 'none';
        }
      });
    });
  });
});





function changeImage(imageSrc) {
  var mainImage = document.getElementById('mainImg');
  mainImage.src = imageSrc;
}


