// backend/game-logic/test-blackjack.js

const { BlackjackGame } = require('./blackjack'); // ./ because same folder

// Create a new game
const game = new BlackjackGame('Alice');
console.log('Game created!');

// Deal initial hands
game.dealInitialHands();
console.log('Initial hands:');
console.log('Player:', game.playerHand);
console.log('Dealer:', game.dealerHand);

// Show hand values
console.log('Player hand value:', game.calculateHandValue(game.playerHand));
console.log('Dealer hand value:', game.calculateHandValue(game.dealerHand));

// Player hits once
const playerValue = game.playerHit();
console.log('Player hits, new hand:', game.playerHand, 'Value:', playerValue);

// Player stands, dealer plays automatically
game.playerStand();

// Show final hands and winner
console.log('Final hands:');
console.log(
  'Player:',
  game.playerHand,
  'Value:',
  game.calculateHandValue(game.playerHand)
);
console.log(
  'Dealer:',
  game.dealerHand,
  'Value:',
  game.calculateHandValue(game.dealerHand)
);
console.log('Winner:', game.winner);
