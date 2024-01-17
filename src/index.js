let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  // Function to fetch and render toys
  const fetchToys = () => {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => renderToy(toy));
      });
  };

  // Function to render a single toy card
  const renderToy = (toy) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    // Add event listener for the like button
    const likeButton = card.querySelector(".like-btn");
    likeButton.addEventListener("click", () => likeToy(toy.id, toy.likes + 1));
  };

  // Function to handle liking a toy
  const likeToy = (toyId, newLikes) => {
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    };

    fetch(`http://localhost:3000/toys/${toyId}`, requestOptions)
      .then((response) => response.json())
      .then((updatedToy) => {
        // Update the toy card in the DOM with the new likes count
        const card = document.querySelector(`#toy-collection .card#${toyId}`);
        card.querySelector("p").innerText = `${updatedToy.likes} Likes`;
      });
  };

  // Event listener for the "Create Toy" button
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Event listener for the toy form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    };

    // Send a POST request to add the new toy
    fetch("http://localhost:3000/toys", requestOptions)
      .then((response) => response.json())
      .then((newToy) => {
        // Render the new toy card in the DOM
        renderToy(newToy);
        // Hide the toy form
        toyFormContainer.style.display = "none";
        // Reset the form values
        toyForm.reset();
      });
  });

  // Fetch and render existing toys on page load
  fetchToys();
});
