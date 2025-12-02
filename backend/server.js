const express = require('express');
const cors = require('cors');
const { Blackjack } = require('./game-logic/blackjack.js');

const app = express();
app.use(cors());
app.use(express.json());

let games = {}; // store active games per playerId
const PORT = 5001;

// --- Start new game
app.post('/start', (req, res) => {
  const { playerId, currentBet, playerBalance } = req.body || {};
  const id = playerId || Date.now().toString();
  const balance = playerBalance || 1000;

  const game = new Blackjack(balance);
  game.dealInitialHands();

  if (currentBet) {
    game.placeBet(currentBet);
  }

  games[id] = game;

  res.json({
    playerId: id,
    playerHand: game.playerHand,
    dealerHand: game.dealerHand,
    playerValue: game.calculateHandValue(game.playerHand),
    playerBalance: game.playerBalance,
    currentBet: game.currentBet,
  });
});

// --- Place bet
app.post('/bet', (req, res) => {
  const { playerId, amount } = req.body;
  const game = games[playerId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  const result = game.placeBet(amount);
  if (!result.success) return res.status(400).json(result);

  res.json({ currentBet: game.currentBet, playerBalance: game.playerBalance });
});

// --- Player action: hit, stand, deal, doubleDown
app.post('/action', (req, res) => {
  const { playerId, action } = req.body;
  const game = games[playerId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  let responseData = {};

  if (action === 'hit') game.playerHit();
  else if (action === 'stand') game.playerStand();
  else if (action === 'deal') game.dealInitialHands();
  else if (action === 'doubleDown') {
    const result = game.doubleDown();
    if (result.error) return res.status(400).json(result);
  }

  responseData = {
    playerHand: game.playerHand,
    dealerHand: game.dealerHand,
    playerValue: game.calculateHandValue(game.playerHand),
    gameOver: game.gameOver,
    winner: game.winner,
    playerBalance: game.playerBalance,
    currentBet: game.currentBet,
  };

  res.json(responseData);
});

// --- Rebet + Deal
app.post('/rebet', (req, res) => {
  const { playerId } = req.body;
  const game = games[playerId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  const previousBet = game.previousBet;
  if (previousBet > game.playerBalance)
    return res.status(400).json({ error: 'Insufficient balance for rebet' });

  // Place previous bet again
  game.placeBet(previousBet);

  // Deal a new hand
  game.dealInitialHands();

  res.json({
    playerHand: game.playerHand,
    dealerHand: game.dealerHand,
    playerValue: game.calculateHandValue(game.playerHand),
    playerBalance: game.playerBalance,
    currentBet: game.currentBet,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
