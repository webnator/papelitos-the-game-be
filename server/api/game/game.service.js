'use strict';

function makeUserService(deps) {
  const {
    socketService,
    makeGameEntity,
  } = deps;

  const ongoingGames = [];

  function broadcastToAllButClient({clients, client, event, payload}) {
    clients.forEach(gameClient => {
      if (gameClient !== client) {
        socketService.sendToClient(gameClient, event, payload);
      }
    });
  }

  return {
    registerGame({client, totalUsers, localUsers}) {
      const newGame = makeGameEntity({
        client,
        totalUsers,
        localUsers
      });
      ongoingGames.push(newGame);
      socketService.sendToClient(client, 'registerNewGame_response', {
        gameId: newGame.gameId
      });
    },

    joinGame({client, code, players}) {
      const game = ongoingGames.find(game => game.gameId.toUpperCase() === code.toUpperCase());
      let response;
      if (!game) {
        response = { error: 'GAME_NOT_FOUND' };
      } else if (game.allowsMorePlayers(players) !== true) {
        response = { error: 'GAME_FULL' };
      } else {
        game.addNewClient({client, players});
        response = {
          result: 'JOIN_GAME_ALL_GOOD',
          data: {
            totalPlayers: game.totalUsers,
            players: game.players,
            teams: game.teams
          }
        };
      }

      socketService.sendToClient(client, 'joinGame_response', response);
    },

    addPlayer({client, code, players}) {
      const game = ongoingGames.find(game => game.gameId.toUpperCase() === code.toUpperCase());
      if (!game) {
        console.error('Adding players to non-existing game');
        return;
      }
      players.forEach(player => {
        game.addPlayer(client, player);
      });
      broadcastToAllButClient({clients: game.clients, client, event: 'playerSet_response', payload: {players}});
    },

    setTeams({client, code, teams}) {
      const game = ongoingGames.find(game => game.gameId.toUpperCase() === code.toUpperCase());
      if (!game) {
        console.error('Setting teams to non-existing game');
        return;
      }
      broadcastToAllButClient({clients: game.clients, client, event: 'teamsSet_response', payload: {teams}});
    },

    setWords({client, code, player, words}) {
      const game = ongoingGames.find(game => game.gameId.toUpperCase() === code.toUpperCase());
      if (!game) {
        console.error('Setting words to non-existing game');
        return;
      }
      game.setWordsForPlayer(player, words);
      broadcastToAllButClient({clients: game.clients, client, event: 'wordEntering_response', payload: {player, word: words}});
    },
  };
}

module.exports = makeUserService;
