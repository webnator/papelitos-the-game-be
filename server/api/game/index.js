'use strict';

module.exports = (server, container) => {
  const gameController = container.resolve('gameController');

  server.route({
    method: 'POST',
    path: '/game',
    handler: gameController.testControls
  });

};
