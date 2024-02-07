//! Global vars
let addToy = false;
const url = 'http://localhost:3001/toys'
const addBtn = document.querySelector('#new-toy-btn');
const toyFormContainer = document.querySelector('.container');
const toyList = document.querySelector('#toy-collection');
const toyForm = document.querySelector('#toy-form');

//! Helpers

function displayToy(toyObj) {
  // placeOnThePage.innerHTML += exampleHTMLCode
  toyList.innerHTML += `
    <div class="card">
      <h2>${toyObj.name}</h2>
      <img src=${toyObj.image} alt=${toyObj.name} class="toy-avatar" />
      <p>${toyObj.likes} Likes</p>
      <button class="like-btn" id="${toyObj.id}">Like ❤️</button>
    </div>
  `
  // //! target the button using the id property
  // const toyLikeBtn = document.getElementById(toyObj.id)
  // //! add an event listener for click
  // toyLikeBtn.addEventListener('click', e => {
  //   //! target the <p> containing the like number
  //   console.log("Inside the click callback")
  //   debugger
  //   //! modify the likes displayed doing +1; hint: parseInt
  // })
}


function fetchToys() {
  return fetch(url)
    .then(resp => resp.json())
    .then(toys => {
      for (let toy of toys) {
        displayToy(toy)
      // toys.forEach(toy => displayToy(toy))
      }
    })
    .then(() => {
        document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          //! target the <p> containing the like number
          const likesParagraph = e.target.previousElementSibling
          const newLikeValue = parseInt(likesParagraph.innerText) + 1
          //! modify the likes displayed doing +1; hint: parseInt
          likesParagraph.innerText = `${newLikeValue} Likes`
          //! OPTIMISTIC APPROACH
          fetch(`${url}/${btn.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({likes: newLikeValue})
          })
          .catch(err => {
            console.log(err)
            likesParagraph.innerText = `${newLikeValue - 1} Likes`
          })

        })
      })
    })
    .catch(err => console.log(err))
}

function submitToy(e) {
  e.preventDefault()
  const totalToys = () => document.querySelectorAll('#toy-collection .card')
  const newToy =  {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0,
    id: totalToys().length + 1
  }
  displayToy(newToy)
  // debugger
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  .catch(err => {
    totalToys()[totalToys().length -1].remove()
    console.log(err)
  })
}

//! Attach listeners

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.classList.add('exampleClass');
    toyFormContainer.style.display = 'block';
  } else {
    toyFormContainer.style.display = 'none';
  }
});

toyForm.addEventListener('submit', submitToy)

//! Invoke functions
function start() {
  fetchToys()
}

start()


