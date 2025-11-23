import React, { useState } from 'react';

export default function BlackjackGame() {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerValue, setPlayerValue] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  const startGame = async () => {
    try {
      console.log('Starting game...');
      const res = await fetch('http://localhost:5001/api/blackjack/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Start game failed:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log('Start game response:', data);

      setPlayerId(data.playerId || null);
      setPlayerHand(data.playerHand || []);
      setDealerHand(data.dealerHand || []);
      setPlayerValue(data.playerValue || 0);
      setGameOver(false);
      setWinner(null);
    } catch (err) {
      console.error('Start game error:', err);
    }
  };

  const playAction = async (action) => {
    if (!playerId) {
      console.warn('Cannot play action: no playerId');
      return;
    }

    try {
      console.log('Playing action:', action, 'playerId:', playerId);

      const res = await fetch('http://localhost:5001/api/blackjack/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, action }),
      });

      if (!res.ok) {
        console.error('Action failed:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log('Action response:', data);

      setPlayerHand(data.playerHand || []);
      setDealerHand(data.dealerHand || []);
      setPlayerValue(data.playerValue || 0);
      setGameOver(data.gameOver || false);
      setWinner(data.winner || null);
    } catch (err) {
      console.error('Play action error:', err);
    }
  };

  return (
    <div>
      <h2>Blackjack</h2>
      <button onClick={startGame}>Start Game</button>

      {playerHand.length > 0 && (
        <>
          <p>
            Player Hand:{' '}
            {playerHand.map((c) => `${c.rank} of ${c.suit}`).join(', ')}
          </p>
          <p>
            Dealer Hand:{' '}
            {dealerHand.map((c) => `${c.rank} of ${c.suit}`).join(', ')}
          </p>
          <p>Player Value: {playerValue}</p>

          {!gameOver ? (
            <>
              <button onClick={() => playAction('hit')}>Hit</button>
              <button onClick={() => playAction('stand')}>Stand</button>
              <button onClick={() => playAction('double')}>Double</button>
            </>
          ) : (
            <p>Winner: {winner}</p>
          )}
        </>
      )}
    </div>
  );
}
