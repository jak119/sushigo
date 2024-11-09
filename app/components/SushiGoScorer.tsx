// app/components/SushiGoScorer.tsx
'use client';

import React, { useState, useEffect } from 'react';

const SushiGoScorer = () => {
  const [players, setPlayers] = useState<Array<{ name: string, scores: number[] }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sushiGoPlayers');
      return saved ? JSON.parse(saved) : [{ name: 'Player 1', scores: [0, 0, 0] }];
    }
    return [{ name: 'Player 1', scores: [0, 0, 0] }];
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('sushiGoPlayers', JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    setPlayers([...players, {
      name: `Player ${players.length + 1}`,
      scores: [0, 0, 0]
    }]);
  };

  const initiateRemovePlayer = (index: number) => {
    setPlayerToDelete(index);
    setShowConfirmation(true);
  };

  const confirmRemovePlayer = () => {
    if (playerToDelete !== null) {
      setPlayers(players.filter((_, i) => i !== playerToDelete));
    }
    setShowConfirmation(false);
    setPlayerToDelete(null);
  };

  const cancelRemovePlayer = () => {
    setShowConfirmation(false);
    setPlayerToDelete(null);
  };

  const updateName = (index: number, newName: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = newName;
    setPlayers(newPlayers);
  };

  const updateScore = (playerIndex: number, roundIndex: number, score: string) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].scores[roundIndex] = parseInt(score) || 0;
    setPlayers(newPlayers);
  };

  const calculateTotal = (scores: number[]): number => {
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const resetScores = () => {
    const newPlayers = players.map(player => ({
      ...player,
      scores: [0, 0, 0]
    }));
    setPlayers(newPlayers);
  };

  return (
    <div className="container-fluid px-2 py-2">
      {showConfirmation && (
        <div className="alert alert-warning mb-2 p-2" role="alert">
          <strong>Remove player?</strong>
          <div className="mt-2">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={confirmRemovePlayer}
            >
              Remove
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={cancelRemovePlayer}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-primary text-white p-2">
          <h5 className="mb-2">Sushi Go Score Tracker</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={resetScores}
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={addPlayer}
            >
              <i className="bi bi-plus"></i> Add Player
            </button>
          </div>
        </div>

        <div className="card-body p-2">
          {players.map((player, playerIndex) => (
            <div key={playerIndex} className="mb-3 p-2 border rounded">
              <div className="d-flex gap-2 align-items-center mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={player.name}
                  onChange={(e) => updateName(playerIndex, e.target.value)}
                  style={{ maxWidth: '120px' }}
                />
                {players.length > 1 && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => initiateRemovePlayer(playerIndex)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>

              <div className="d-flex gap-2 align-items-center">
                {player.scores.map((score, roundIndex) => (
                  <div key={roundIndex} className="flex-grow-1">
                    <label className="form-label small mb-1">
                      Round {roundIndex + 1}
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center"
                      value={score}
                      min="0"
                      onChange={(e) => updateScore(playerIndex, roundIndex, e.target.value)}
                    />
                  </div>
                ))}
                <div className="flex-grow-1">
                  <label className="form-label small mb-1">Total</label>
                  <div className="form-control form-control-sm text-center bg-light">
                    {calculateTotal(player.scores)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SushiGoScorer;