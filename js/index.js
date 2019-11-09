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
    cardsWrapper.append(cardElement);
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
    newButton = document.createElement("button");
    newButton.type = "button";
    newButton.id = gameButton;
    newButton.classList.add("btn", "btn-lg", "btn-secondary", "mx-2");
    newButton.innerText = gameButton.text;
    newButton.addEventListener("click", gameButton.function);
    buttonWrapper.append(newButton);
  });
}
//Function that toggles the class 'shuffling' on the cards wrapper to animate 'stacking' the cards
function toggleStackedCards() {
  const cardsWrapper = document.querySelector(".cards-wrapper");
  cardsWrapper.classList.add("shuffling");
  //Timeout to remove the 'shuffling' class to allow the cards to spread out according to their 'left' css property
  setTimeout(function() {
    cardsWrapper.classList.remove("shuffling");
  }, 1500);
}
//Function to shuffle cards into a random order
function shuffleCards() {
  toggleStackedCards();
  const cards = document.querySelectorAll(".card");
  const cardsWrapper = document.querySelector(".cards-wrapper");
  //Create an array of values from 0-51 to represent cards in a deck
  let orderedDeck = Array.from(new Array(52), (x, i) => i);

  //Use the Fisher-Yates Shuffle algorithm to shuffle these values into a random order in a new array call shuffledDeck
  let shuffledDeck = [],
    n = orderedDeck.length,
    i;
  while (n) {
    i = Math.floor(Math.random() * n--);
    shuffledDeck.push(orderedDeck.splice(i, 1)[0]);
  }
  //Set timeout to account for animation of cards stacking
  //Callback function passes over all cards and inserts them to the position of their index in the shuffled deck array
  setTimeout(function() {
    cards.forEach((card, i) => {
      cardsWrapper.insertBefore(card, cards[shuffledDeck[i]]);
    });
    //Refetch the array of all cards in the dom, now shuffled, and correctly updates their absolute positioning to appear spread out again
    const shuffledCards = document.querySelectorAll(".card");
    shuffledCards.forEach((card, i) => {
      card.style.left = `${i * 30}px`;
    });
  }, 1000);
}

//Function to toggle cards between face up and face down (adding and removing 'hidden' class)
function toggleCards() {
  const cardsWrapper = document.querySelector(".cards-wrapper");
  cardsWrapper.classList.toggle("hidden");
}

//Function to return shuffled cards to ordered by suit
function magicTrick() {
  toggleStackedCards();
  const shuffledCards = document.querySelectorAll(".card");

  //Set timeout to account for animation of cards stacking
  setTimeout(function() {
    cards.forEach((card, i) => {
      card.style.left = `${i * 30}px`;
      card.style.zIndex = `${i}`;
    });
  }, 1000);
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createButtons();
  createCards();
}

document.getElementById("start-game").addEventListener("click", startGame);
