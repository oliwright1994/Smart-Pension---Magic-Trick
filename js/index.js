const suits = ["hearts", "spades", "diamonds", "clubs"];
const cardsWrapper = document.querySelector(".cards-wrapper");

function createCards() {
  const cards = [];
  // Create an array with objects containing the value and the suit of each card
  suits.forEach(suit => {
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit
      };
      cards.push(cardObject);
    }
  });

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 30;
    const cardElement = document.createElement("div");
    cardElement.setAttribute("data-value", card.value);
    cardElement.classList.add("card", `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    const cardFace = document.createElement("div");
    cardFace.classList.add("card-face");
    cardFace.innerHTML = `<p class='top'>
    <span class='value'></span>
    <span class='suit'></span>
    </p>
    <h1 class='suit center'></h1>
    <p class='bottom'>
    <span class='value'></span>
    <span class='suit'></span>
    </p>`;
    cardElement.appendChild(cardFace);
    const logo = document.createElement("img");
    logo.src = "./assets/smart-logo.svg";
    logo.style.display = "none";
    cardElement.appendChild(logo);
    cardsWrapper.append(cardElement);
  });
}

// Function that toggles the class 'shuffling' on the cards wrapper to animate 'stacking' the cards
function toggleStackedCards() {
  cardsWrapper.classList.add("shuffling");
  // Timeout to remove the 'shuffling' class to allow the cards to spread out according to
  // their 'left' css property
  setTimeout(() => {
    cardsWrapper.classList.remove("shuffling");
  }, 1500);
}
// Function to shuffle cards into a random order
function shuffleCards() {
  // Call to function to 'stack' cards
  toggleStackedCards();
  const cards = document.querySelectorAll(".card");

  // Create an array of values from 0-51 to represent cards in a deck
  const orderedDeck = Array.from(new Array(52), (x, i) => i);

  // Use the Fisher-Yates Shuffle algorithm to shuffle these values into a random order
  // in a new array call shuffledDeck
  const shuffledDeck = [];
  let n = orderedDeck.length;
  let i;
  while (n) {
    i = Math.round(Math.random() * (n -= 1));
    shuffledDeck.push(orderedDeck.splice(i, 1)[0]);
  }
  // Create an array of all card classes currently rendered to the dom
  const allCardClasses = [...cards].map(card => card.classList[1]);

  // Pass once over each card element and remove its current card specific class and replace it with
  // the class in the same position from the array of shuffled classes
  cards.forEach((card, j) => {
    card.classList.remove(card.classList[1]);
    card.classList.add(allCardClasses[shuffledDeck[j]]);
  });

  // Refetch the array of all cards in the DOM, now shuffled, and correctly updates their
  // absolute positioning to appear spread out again once the cards are unstacked
  const shuffledCards = document.querySelectorAll(".card");
  shuffledCards.forEach((card, j) => {
    card.style.left = `${j * 30}px`;
  });
}

// Function to toggle cards between face up and face down (adding and removing 'hidden' class)
function toggleCards() {
  cardsWrapper.classList.toggle("hidden");
}

// Function to return shuffled cards to ordered by suit
function magicTrick() {
  toggleStackedCards();
  const shuffledCards = document.querySelectorAll(".card");

  const allCardClasses = [];
  // Create an array with objects containing the value and the suit of each card
  suits.forEach(suit => {
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit
      };
      allCardClasses.push(cardObject);
    }
  });

  // Pass once over each card element and remove its current card specific class and replace it with
  // the class from the order array of card classes
  shuffledCards.forEach((card, i) => {
    card.classList.remove(card.classList[1]);
    card.classList.add(`${allCardClasses[i].suit}-${allCardClasses[i].value}`);
  });
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  const startButton = document.getElementById("start-game");
  startButton.remove();
  const buttonWrapper = document.querySelector(".btn-wrapper");
  const gameButtons = [
    { text: "Shuffle", function: shuffleCards },
    { text: "Show/Hide", function: toggleCards },
    { text: "Magic", function: magicTrick }
  ];
  gameButtons.forEach(gameButton => {
    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.id = gameButton;
    newButton.classList.add("btn", "btn-lg", "btn-secondary", "mx-2");
    newButton.innerText = gameButton.text;
    newButton.addEventListener("click", gameButton.function);
    buttonWrapper.append(newButton);
  });
}
// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createButtons();
  createCards();
}

document.getElementById("start-game").addEventListener("click", startGame);
