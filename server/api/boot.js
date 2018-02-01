'use strict';

const { createContainer, asValue, asFunction, asClass } = require('awilix');
const container = createContainer();

// Init
const makeAppInit = require('./../init');

// Libraries
const WebSocket = require('ws');

const socketHandlers = require('./game/socketHandlers');

// Services
const ErrorService = require('./services/errors.service');
const ResponsesService = require('./services/responses.service');
const SchemaService = require('./services/schema.service');
const SocketService = require('./services/socket.service');
const GlobalService = require('./services/global.service');

// game entity
const makeGameController = require('./game/game.controller');
const makeGameService = require('./game/game.service');
const makeGameResponses = require('./game/game.responses');
const GameEntity = require('./game/game.entity');

container.register({
  // Libs
  WebSocket: asValue(WebSocket),

  // Initial
  appInit: asFunction(makeAppInit).singleton(),
  socketHandlers: asFunction(socketHandlers).singleton(),

  // config

  // services
  errorService: asFunction(() => ErrorService).singleton(),
  responsesService: asFunction(() => ResponsesService).singleton(),
  schemaService: asFunction(() => SchemaService).singleton(),
  socketService: asClass(SocketService).singleton(),
  GlobalService: asFunction(() => GlobalService).singleton(),

  // game entity
  gameController: asFunction(makeGameController).singleton(),
  gameService: asFunction(makeGameService).singleton(),
  gameResponses: asFunction(makeGameResponses).singleton(),
  makeGameEntity: asFunction(instantiateEntityWithDependencies(GameEntity)).singleton(),

});

function instantiateEntityWithDependencies(entity) {
  return (deps) => (...args) => new entity(deps, ...args);
}

module.exports = container;
