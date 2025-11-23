// blackjack.js
class Blackjack {
  constructor() {
    this.deck = this.createDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.gameOver = false;
    this.winner = null;
  }

  // Create a shuffled deck
  createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
      'A',
    ];
    const deck = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  // Deal initial two cards to player and dealer
  dealInitialHands() {
    this.playerHand = [this.deck.pop(), this.deck.pop()];
    this.dealerHand = [this.deck.pop(), this.deck.pop()];
  }

  // Calculate hand value
  calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      if (['J', 'Q', 'K'].includes(card.rank)) value += 10;
      else if (card.rank === 'A') {
        value += 11;
        aces++;
      } else value += parseInt(card.rank);
    }

    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }

  // Player hits
  playerHit() {
    this.playerHand.push(this.deck.pop());
    const value = this.calculateHandValue(this.playerHand);

    if (value > 21) {
      this.gameOver = true;
      this.winner = 'dealer';
    }

    return value;
  }

  // Player stands
  playerStand() {
    while (this.calculateHandValue(this.dealerHand) < 17) {
      this.dealerHand.push(this.deck.pop());
    }

    const playerValue = this.calculateHandValue(this.playerHand);
    const dealerValue = this.calculateHandValue(this.dealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) this.winner = 'player';
    else if (dealerValue > playerValue) this.winner = 'dealer';
    else this.winner = 'push';

    this.gameOver = true;
  }
}

module.exports = { Blackjack };
