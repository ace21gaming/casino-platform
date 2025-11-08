// backend/game-logic/blackjack.js

class BlackjackGame {
  constructor(playerName = "Player") {
    this.deck = createDeck();
    this.shuffleDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.playerName = playerName;
    this.bet = 0;
    this.gameOver = false;
    this.winner = null;
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealInitialHands() {
    this.playerHand.push(this.deck.pop(), this.deck.pop());
    this.dealerHand.push(this.deck.pop());
  }

  calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
      if (["J", "Q", "K"].includes(card.rank)) value += 10;
      else if (card.rank === "A") {
        value += 11;
        aces += 1;
      } else value += Number(card.rank);
    }
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    return value;
  }

  playerHit() {
    if (this.gameOver) return;
    this.playerHand.push(this.deck.pop());
    const playerValue = this.calculateHandValue(this.playerHand);
    if (playerValue > 21) this.endGame("dealer");
    return playerValue;
  }

  playerStand() {
    if (this.gameOver) return;
    this.dealerPlay();
    this.determineWinner();
  }

  dealerPlay() {
    while (this.calculateHandValue(this.dealerHand) < 17) {
      this.dealerHand.push(this.deck.pop());
    }
  }

  determineWinner() {
    const playerValue = this.calculateHandValue(this.playerHand);
    const dealerValue = this.calculateHandValue(this.dealerHand);

    if (playerValue > 21) this.endGame("dealer");
    else if (dealerValue > 21) this.endGame("player");
    else if (playerValue > dealerValue) this.endGame("player");
    else if (playerValue < dealerValue) this.endGame("dealer");
    else this.endGame("tie");
  }

  endGame(winner) {
    this.gameOver = true;
    this.winner = winner;
  }
}

// Helper function to create a deck
function createDeck() {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

module.exports = { BlackjackGame, createDeck };
