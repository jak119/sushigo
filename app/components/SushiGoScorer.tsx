// app/components/SushiGoScorer.tsx
'use client';

import React, { useState, useEffect } from 'react';

const SushiGoScorer = () => {
  const [players, setPlayers] = useState<Array<{ name: string, scores: number[] }>>(() => {
    // Only access localStorage on client side
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
    <div className="container py-4">
      {showConfirmation && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Remove player?</strong> This action cannot be undone.
          <div className="mt-2">
            <button
              className="btn btn-danger me-2"
              onClick={confirmRemovePlayer}
            >
              Remove
            </button>
            <button
              className="btn btn-secondary"
              onClick={cancelRemovePlayer}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Sushi Go Score Tracker</h4>
            <div>
              <button
                className="btn btn-outline-light me-2"
                onClick={resetScores}
              >
                Reset
              </button>
              <button
                className="btn btn-light"
                onClick={addPlayer}
              >
                <i className="bi bi-plus"></i> Add Player
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="text-start">Player</th>
                  <th className="text-center">Round 1</th>
                  <th className="text-center">Round 2</th>
                  <th className="text-center">Round 3</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, playerIndex) => (
                  <tr key={playerIndex}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={player.name}
                        onChange={(e) => updateName(playerIndex, e.target.value)}
                      />
                    </td>
                    {player.scores.map((score, roundIndex) => (
                      <td key={roundIndex}>
                        <input
                          type="number"
                          className="form-control text-center mx-auto"
                          style={{ maxWidth: '80px' }}
                          value={score}
                          min="0"
                          onChange={(e) => updateScore(playerIndex, roundIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="text-center fw-bold">
                      {calculateTotal(player.scores)}
                    </td>
                    <td className="text-center">
                      {players.length > 1 && (
                        <button
                          className="btn btn-danger"
                          onClick={() => initiateRemovePlayer(playerIndex)}
                          title="Remove Player"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SushiGoScorer;