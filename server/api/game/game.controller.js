'use strict';

function makeGameController(deps) {
  const {
    errorService,
    responsesService,
    gameService,
    socketService,
    gameResponses,
    schemaService
  } = deps;

  return {
    /**
     * Registers a new game for the client and saves it
     * @param {WebSocket} client - The websocket client instance
     * @param {Object} message - The message payload
     * @returns {Promise<void>}
     */
    async registerNewGame(client, message) {
      console.log('Registering new game');
      gameService.registerGame({
        client,
        totalUsers: message.totalPlayers,
        localUsers: message.localPlayers
      });
    },

    /**
     * Join an already existing game
     * @param {WebSocket} client - The websocket client instance
     * @param {Object} message - The message payload
     * @returns {Promise<void>}
     */
    async joinGame(client, message) {
      console.log('Joining game', message.code, 'with', message.players);
      gameService.joinGame({ code: message.code, client, players: message.players })
    },

    /**
     * Add player from client to an already existing game
     * @param {WebSocket} client - The websocket client instance
     * @param {Object} message - The message payload
     * @returns {Promise<void>}
     */
    async addPlayer(client, message) {
      console.log('Adding players to game', message.code);
      gameService.addPlayer({ code: message.code, client, players: message.players })
    },

    /**
     * Set the teams to an already existing game
     * @param {WebSocket} client - The websocket client instance
     * @param {Object} message - The message payload
     * @returns {Promise<void>}
     */
    async setTeams(client, message) {
      console.log('Setting teams to game', message.code);
      gameService.setTeams({ code: message.code, client, teams: message.teams })
    },

    /**
     * Enter the words for a player
     * @param {WebSocket} client - The websocket client instance
     * @param {Object} message - The message payload
     * @returns {Promise<void>}
     */
    async enterPlayerWords(client, message) {
      console.log('Setting words in game', message.code, 'for player', message.player);
      gameService.setWords({ code: message.code, client, player: message.player, words: message.words})
    },

    async testControls(request, reply) {
      console.log('Registering new game for client');
      socketService.broadcastMessage(request.payload.event, request.payload.payload);
      reply({message: 'All good!'}).code(200);
    }
  };
}

module.exports = makeGameController;
