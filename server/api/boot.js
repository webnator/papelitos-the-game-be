'use strict';

const { createContainer, asValue, asFunction, asClass } = require('awilix');
const container = createContainer();

// Init
const makeAppInit = require('./../init');

// Libraries
const WebSocket = require('ws');

const socketHandlers = require('./../api/user/socketHandlers');

// Services
const ErrorService = require('./services/errors.service');
const ResponsesService = require('./services/responses.service');
const SchemaService = require('./services/schema.service');
const SocketService = require('./services/socket.service');
const GlobalService = require('./services/global.service');

// user entity
const makeUserController = require('./user/user.controller');
const makeUserService = require('./user/user.service');
const makeUserResponses = require('./user/user.responses');
const UserEntity = require('./user/user.entity');

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

  // user entity
  userController: asFunction(makeUserController).singleton(),
  userService: asFunction(makeUserService).singleton(),
  userResponses: asFunction(makeUserResponses).singleton(),
  UserEntity: asFunction(instantiateEntityWithDependencies(UserEntity)).singleton(),

});

function instantiateEntityWithDependencies(entity) {
  return (deps) => (...args) => new entity(deps, ...args);
}

module.exports = container;
