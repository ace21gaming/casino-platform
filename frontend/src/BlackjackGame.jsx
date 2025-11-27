import React, { useState } from 'react';

export default function Blackjack() {
  const [playerId, setPlayerId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerValue, setPlayerValue] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Automatically picks local or production backend
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const startGame = async () => {
    if (!BACKEND_URL) {
      console.error('Backend URL not set!');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/start`, { method: 'POST' });
      const data = await res.json();

      setPlayerId(data.playerId);
      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setPlayerValue(data.playerValue);
      setGameOver(false);
      setWinner(null);
    } catch (err) {
      console.error('Start game error:', err);
    }
  };

  const playAction = async (action) => {
    if (!playerId || !BACKEND_URL) return;

    try {
      const res = await fetch(`${BACKEND_URL}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, action }),
      });

      const data = await res.json();

      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setPlayerValue(data.playerValue);
      setGameOver(data.gameOver);
      setWinner(data.winner);
    } catch (err) {
      console.error('Play action error:', err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Blackjack</h1>
      <button onClick={startGame} style={{ margin: '10px' }}>
        Start Game
      </button>

      {playerHand.length > 0 && (
        <>
          <p>
            <strong>Player Hand:</strong>{' '}
            {playerHand.map((c) => `${c.rank} of ${c.suit}`).join(', ')}
          </p>
          <p>
            <strong>Dealer Hand:</strong>{' '}
            {dealerHand.map((c) => `${c.rank} of ${c.suit}`).join(', ')}
          </p>
          <p>Player Value: {playerValue}</p>

          {!gameOver ? (
            <>
              <button
                onClick={() => playAction('hit')}
                style={{ margin: '5px' }}
              >
                Hit
              </button>
              <button
                onClick={() => playAction('stand')}
                style={{ margin: '5px' }}
              >
                Stand
              </button>
            </>
          ) : (
            <h2>Winner: {winner?.toUpperCase()}</h2>
          )}
        </>
      )}
    </div>
  );
}
