'use strict';

function makeUserController(deps) {
  const {
    errorService,
    responsesService,
    userService,
    userResponses,
    schemaService
  } = deps;

  return {
    async login(client, message) {
      console.log(message);
      client.send(JSON.stringify({code: 123}));
    },
  };
}

module.exports = makeUserController;
