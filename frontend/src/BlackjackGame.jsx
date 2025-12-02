import React, { useState } from 'react';

export default function BlackjackGame() {
  const [playerId, setPlayerId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerValue, setPlayerValue] = useState(0);
  const [playerBalance, setPlayerBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hideDealerHoleCard, setHideDealerHoleCard] = useState(true);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // --- Place Bet
  const placeBet = (amount) => {
    if (amount > playerBalance) {
      alert('Insufficient balance!');
      return;
    }
    setCurrentBet(amount);
  };

  // --- Deal Cards
  const dealCards = async () => {
    if (currentBet === 0) {
      alert('Place a bet first!');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, currentBet, playerBalance }),
      });
      const data = await res.json();

      setPlayerId(data.playerId);
      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setPlayerValue(data.playerValue);
      setPlayerBalance(data.playerBalance);
      setGameOver(false);
      setWinner(null);
      setHideDealerHoleCard(true);
      setCurrentBet(data.currentBet);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Player Actions
  const playAction = async (action) => {
    if (!playerId) return;

    try {
      const res = await fetch(`${BACKEND_URL}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, action }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setPlayerValue(data.playerValue);
      setPlayerBalance(data.playerBalance);
      setGameOver(data.gameOver);
      setWinner(data.winner);
      setHideDealerHoleCard(!data.gameOver);
      setCurrentBet(data.currentBet);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Double Down
  const doubleDown = async () => {
    await playAction('doubleDown');
  };

  // --- Rebet + Deal
  const rebetDeal = async () => {
    if (!playerId) return;
    try {
      const res = await fetch(`${BACKEND_URL}/rebet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setPlayerValue(data.playerValue);
      setPlayerBalance(data.playerBalance);
      setCurrentBet(data.currentBet);
      setGameOver(false);
      setWinner(null);
      setHideDealerHoleCard(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Blackjack</h1>
      <h3>Balance: ${playerBalance}</h3>
      <h3>Current Bet: ${currentBet}</h3>

      {/* Betting Buttons */}
      <div>
        <button onClick={() => placeBet(50)}>Bet $50</button>
        <button onClick={() => placeBet(100)}>Bet $100</button>
        <button onClick={() => placeBet(200)}>Bet $200</button>
      </div>

      {/* Deal button */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={dealCards}>Deal</button>
      </div>

      {/* Hands */}
      {playerHand.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>Player Hand:</strong>{' '}
            {playerHand.map((c) => `${c.rank} of ${c.suit}`).join(', ')}
          </p>
          <p>Player Value: {playerValue}</p>

          <p>
            <strong>Dealer Hand:</strong>{' '}
            {dealerHand
              .map((c, i) =>
                i === 1 && hideDealerHoleCard
                  ? 'Hidden'
                  : `${c.rank} of ${c.suit}`
              )
              .join(', ')}
          </p>

          {!gameOver ? (
            <>
              <button onClick={() => playAction('hit')}>Hit</button>
              <button onClick={() => playAction('stand')}>Stand</button>
              <button onClick={doubleDown}>Double Down</button>
            </>
          ) : (
            <>
              <h2>Winner: {winner?.toUpperCase()}</h2>
              <button onClick={dealCards}>Deal</button>
              <button onClick={rebetDeal}>Rebet & Deal</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
