// backend/server.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const { Blackjack } = require('./game-logic/blackjack');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'https://ace21gaming.github.io', credentials: true }));
app.use(express.json());

const games = {};

app.get('/', (req, res) => res.send('Backend ready'));

app.post('/api/blackjack/start', (req, res) => {
  try {
    const playerId = uuidv4();
    const game = new Blackjack();
    game.dealInitialHands();
    games[playerId] = game;

    res.json({
      playerId,
      playerHand: game.playerHand,
      dealerHand: [game.dealerHand[0]],
      playerValue: game.calculateHandValue(game.playerHand),
    });
  } catch (err) {
    console.error('Error in /api/blackjack/start:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blackjack/action', (req, res) => {
  try {
    const { playerId, action } = req.body;
    const game = games[playerId];
    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (game.gameOver)
      return res.json({ message: 'Game over', winner: game.winner });

    let playerValue;
    switch (action) {
      case 'hit':
        playerValue = game.playerHit();
        break;
      case 'stand':
        game.playerStand();
        playerValue = game.calculateHandValue(game.playerHand);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({
      playerHand: game.playerHand,
      dealerHand: game.gameOver ? game.dealerHand : [game.dealerHand[0]],
      playerValue,
      gameOver: game.gameOver,
      winner: game.winner || null,
    });
  } catch (err) {
    console.error('Error in /api/blackjack/action:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
