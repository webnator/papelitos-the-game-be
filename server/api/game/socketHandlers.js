'use strict';

module.exports = (deps) => {
  const {
    gameController
  } = deps;
  return [{
    event: 'registerNewGame',
    handler: gameController.registerNewGame
  }, {
    event: 'joinGame',
    handler: gameController.joinGame
  }, {
    event: 'playerSet',
    handler: gameController.addPlayer
  }, {
    event: 'teamsSet',
    handler: gameController.setTeams
  }, {
    event: 'wordEntering',
    handler: gameController.enterPlayerWords
  }, {
    event: 'startTurn',
    handler: gameController.startTurn
  }, {
    event: 'finishTurn',
    handler: gameController.finishTurn
  }, {
    event: 'wordGuessed',
    handler: gameController.wordGuessed
  }, {
    event: 'beginPlayerTurns',
    handler: gameController.beginPlayerTurns
  }];
};
