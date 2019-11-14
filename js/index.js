const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
const cardsWrapper = document.querySelector('.cards-wrapper');


// Function to remove all card divs from the DOM
function clearCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.remove();
  });
}

function createCards() {
  clearCards();
  const cards = [];
  // Create an array with objects containing the value and the suit of each card
  suits.forEach((suit) => {
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit,
      };
      cards.push(cardObject);
    }
  });

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 30;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.value);
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    const cardFace = document.createElement('div');
    cardFace.classList.add('card-face');
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
    const logo = document.createElement('img');
    logo.src = './assets/smart-logo.svg';
    logo.style.display = 'none';
    cardElement.appendChild(logo);
    cardsWrapper.append(cardElement);
  });
}

// Function that toggles the class 'shuffling' on the cards wrapper to animate 'stacking' the cards
function toggleStackedCards() {
  cardsWrapper.classList.add('shuffling');
  // Timeout to remove the 'shuffling' class to allow the cards to spread out according to
  // their 'left' css property
  setTimeout(() => {
    cardsWrapper.classList.remove('shuffling');
  }, 1500);
}

// Function to shuffle cards into a random order
function shuffleCards() {
  // Call to function to 'stack' cards
  toggleStackedCards();
  const cards = document.querySelectorAll('.card');

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
  const allCardClasses = [...cards].map((card) => card.classList[1]);

  // Pass once over each card element and remove its current card specific class and replace it with
  // the class in the same position from the array of shuffled classes
  cards.forEach((card, j) => {
    card.classList.remove(card.classList[1]);
    card.classList.add(allCardClasses[shuffledDeck[j]]);
  });

  // Refetch the array of all cards in the DOM, now shuffled, and correctly updates their
  // absolute positioning to appear spread out again once the cards are unstacked
  const shuffledCards = document.querySelectorAll('.card');
  shuffledCards.forEach((card, j) => {
    card.style.left = `${j * 30}px`;
  });
}

// Function to toggle cards between face up and face down (adding and removing 'hidden' class)
function toggleCards() {
  cardsWrapper.classList.toggle('hidden');
}

// Function to return shuffled cards to ordered by suit
function magicTrick() {
  toggleStackedCards();
  const shuffledCards = document.querySelectorAll('.card');

  const allCardClasses = [];
  // Create an array with objects containing the value and the suit of each card
  suits.forEach((suit) => {
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit,
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

function stackCards() {
  cardsWrapper.classList.add('shuffling');
}


function dealFirstCard() {
  const gameButtons = document.querySelectorAll('button');

  // Disables higher and lower buttons so the user cannot choose an option before the card is dealt,
  // prevents error where chooseCard function cannot find the card as the ids have not been
  // assigned yet
  gameButtons.forEach((button) => {
    button.setAttribute('disabled', true);
  });

  // Selects a card at random from all rendered card divs and adds an id to the card to change
  // the css so the card appears to have been 'dealt'
  setTimeout(() => {
    const cards = document.querySelectorAll('.card');
    const firstCard = cards[Math.round(Math.random() * 51)];
    firstCard.id = 'hl-first';
    document.querySelector('.hl-msg').innerText = 'Is the next card higher or lower?';

    // Re-enables higher/lower buttons
    gameButtons.forEach((button) => {
      button.removeAttribute('disabled');
    });
  }, 2000);
}

// Function to handle response when higher or lower button is clicked
function chooseCard(event) {
  const choice = event.target.id;
  const gameMessage = document.querySelector('.hl-msg');
  const cards = document.querySelectorAll('.card');
  const secondCard = cards[Math.round(Math.random() * 50)];
  secondCard.id = 'hl-second';
  // Updates game message to show result based on the data value of the two cards dealt
  const firstCard = document.getElementById('hl-first');
  const cardDiff = secondCard.attributes[0].nodeValue - firstCard.attributes[0].nodeValue;
  if (
    (cardDiff > 0 && choice === 'higher')
    || (cardDiff < 0 && choice === 'lower')
  ) {
    gameMessage.innerText = 'Correct!';
  } else if (
    secondCard.attributes[0].nodeValue === firstCard.attributes[0].nodeValue
  ) {
    gameMessage.innerText = 'Draw!';
  } else {
    gameMessage.innerText = 'Wrong!';
  }
  // Removes ids from the two current game cards to 'return' them to the deck, invokes
  // function to deal the first card after timeout to account for animation of cards moving.
  setTimeout(() => {
    firstCard.id = null;
    secondCard.id = null;
    dealFirstCard();
  }, 1500);
}

const gameButtons = [
  { text: 'Shuffle', function: shuffleCards },
  { text: 'Show/Hide', function: toggleCards },
  { text: 'Magic', function: magicTrick },
  { text: 'Higher/Lower', function: higherLower },
];

const higherLowerButtons = [
  { text: 'Higher', function: chooseCard },
  { text: 'Lower', function: chooseCard },
  { text: 'Reset', function: resetGame },
];

// Function to clear out the initial button and create new buttons depending on which array
// of buttons is supplied
function createButtons(selectedButtons) {
  const initialButtons = document.querySelectorAll('button');
  initialButtons.forEach((button) => {
    button.remove();
  });
  const buttonWrapper = document.querySelector('.btn-wrapper');

  selectedButtons.forEach((gameButton) => {
    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.id = gameButton.text.toLowerCase();
    newButton.classList.add('btn', 'btn-lg', 'btn-secondary', 'mx-2');
    newButton.innerText = gameButton.text;
    newButton.addEventListener('click', gameButton.function);
    buttonWrapper.append(newButton);
  });
}

// Function to initiate game state for higher/lower
function higherLower() {
  createButtons(higherLowerButtons);
  stackCards();
  toggleCards();
  dealFirstCard();
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createButtons(gameButtons);
  createCards();
}
// Function to reset page from higher/lower to the same state as after start game button is clicked
function resetGame() {
  cardsWrapper.classList.remove('shuffling');
  cardsWrapper.classList.toggle('hidden');
  document.querySelector('.hl-msg').innerText = '';
  startGame();
}
document.getElementById('start-game').addEventListener('click', startGame);
