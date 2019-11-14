const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
const sortedCardsClasses = [];
suits.forEach((suit) => [...Array(13)].forEach((_, i) => sortedCardsClasses.push(`${suit}-${i + 1}`)));

describe('Play game', () => {
  it('Visits the game and play', () => {
    cy.visit('./index.html');
    cy.get('.navbar-brand img').should('have.exist');
    cy.get('.navbar-brand')
      .should('have.attr', 'href')
      .and('eq', 'https://www.autoenrolment.co.uk');
    cy.get('h1').should('have.text', 'Become a software engineer at Smart');
    cy.get('h3').should(
      'have.text',
      'Join Smart by simply performing a magic trick',
    );
    cy.get('p').should('have.exist');
    cy.get('#start-game')
      .should('have.text', "Let's get started")
      .click();
    cy.get('[class*="hearts-"]').should('have.length', 13);

    cy.get('#start-game').should('have.not.exist');
    suits.forEach((suit) => {
      cy.get(`[class*='${suit}-']`).should('have.length', 13);
    });

    cy.get('.card').then((cards) => {
      expect(cards.length).to.equal(52);
    });

    cy.get('.card').then((cards) => {
      const allCardClasses = [...cards].map((card) => card.classList[1]);
      expect(allCardClasses).to.deep.equal(sortedCardsClasses);
    });

    cy.contains('Shuffle').click();
    cy.get('.card').then((cards) => {
      const allCardClasses = [...cards].map((card) => card.classList[1]);
      expect(allCardClasses).to.not.deep.equal(sortedCardsClasses);
    });

    cy.contains('Show/Hide').click();
    cy.get('.cards-wrapper').should('have.class', 'hidden');

    cy.contains('Show/Hide').click();
    cy.get('.cards-wrapper').should('not.have.class', 'hidden');

    cy.contains('Magic').click();
    cy.get('.card').then((cards) => {
      const allCardClasses = [...cards].map((card) => card.classList[1]);
      expect(allCardClasses).to.deep.equal(sortedCardsClasses);
    });
  });
});

describe('Cards are shuffled randomly each time', () => {
  it('Clicks the shuffle button twice', () => {
    cy.visit('./index.html');
    cy.get('#start-game')
      .should('have.text', "Let's get started")
      .click();
    cy.contains('Shuffle').click();
    cy.get('.card').then((cardsFirstShuffle) => {
      const firstShuffledCardClasses = [...cardsFirstShuffle].map(
        (card) => card.classList[1],
      );
      cy.contains('Shuffle').click();
      cy.get('.card').then((cardsSecondShuffle) => {
        const secondShuffledCardsClasses = [...cardsSecondShuffle].map(
          (card) => card.classList[1],
        );
        expect(firstShuffledCardClasses).to.not.deep.equal(
          secondShuffledCardsClasses,
        );
      });
    });
  });
});

describe('Cards are stacked and unstacked when magic or shuffle button is clicked', () => {
  it('Clicks the Shuffle button, waits, then clicks the Magic button', () => {
    cy.visit('./index.html');
    cy.get('#start-game')
      .should('have.text', "Let's get started")
      .click();
    cy.contains('Shuffle').click();
    cy.get('.cards-wrapper').should('have.class', 'shuffling');
    cy.wait(1500);
    cy.get('.cards-wrapper').should('not.have.class', 'shuffling');
    cy.contains('Magic').click();
    cy.get('.cards-wrapper').should('have.class', 'shuffling');
    cy.wait(1500);
    cy.get('.cards-wrapper').should('not.have.class', 'shuffling');
  });
});

