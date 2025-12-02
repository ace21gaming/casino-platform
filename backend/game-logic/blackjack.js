class Blackjack {
  constructor(playerBalance = 1000) {
    this.deck = this.createDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.gameOver = false;
    this.winner = null;

    // Betting
    this.playerBalance = playerBalance;
    this.currentBet = 0;
    this.previousBet = 0; // store previous bet for rebet
  }

  // Create and shuffle deck
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
      for (const rank of ranks) deck.push({ suit, rank });
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // Deal cards and reset game state
  dealInitialHands() {
    this.playerHand = [this.deck.pop(), this.deck.pop()];
    this.dealerHand = [this.deck.pop(), this.deck.pop()];
    this.gameOver = false;
    this.winner = null;
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
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    return value;
  }

  // Place a bet
  placeBet(amount) {
    if (amount > this.playerBalance)
      return { success: false, error: 'Insufficient balance' };
    this.currentBet = amount;
    this.previousBet = amount;
    this.playerBalance -= amount;
    return {
      success: true,
      currentBet: this.currentBet,
      playerBalance: this.playerBalance,
    };
  }

  // Player hits
  playerHit() {
    this.playerHand.push(this.deck.pop());
    const value = this.calculateHandValue(this.playerHand);
    if (value > 21) {
      this.gameOver = true;
      this.winner = 'dealer';
      this.resolveBet();
    }
    return value;
  }

  // Player stands
  playerStand() {
    while (this.calculateHandValue(this.dealerHand) < 17)
      this.dealerHand.push(this.deck.pop());

    const playerValue = this.calculateHandValue(this.playerHand);
    const dealerValue = this.calculateHandValue(this.dealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) this.winner = 'player';
    else if (dealerValue > playerValue) this.winner = 'dealer';
    else this.winner = 'push';

    this.gameOver = true;
    this.resolveBet();
  }

  // --- Double Down ---
  doubleDown() {
    if (this.playerBalance < this.currentBet)
      return { error: 'Insufficient balance to double down' };

    this.playerBalance -= this.currentBet;
    this.currentBet *= 2;

    // Draw exactly one card and end hand
    this.playerHand.push(this.deck.pop());
    this.playerStand();

    return {
      success: true,
      playerHand: this.playerHand,
      playerBalance: this.playerBalance,
      currentBet: this.currentBet,
    };
  }

  // Resolve bet
  resolveBet() {
    if (this.winner === 'player') this.playerBalance += this.currentBet * 2;
    else if (this.winner === 'push') this.playerBalance += this.currentBet;

    this.currentBet = 0;
  }
}

module.exports = { Blackjack };
