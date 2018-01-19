'use strict';

module.exports = (deps) => {
  const {
    userController
  } = deps;
  return [
    {
      event: 'registerNewGame',
      handler: userController.login
    }
  ];
};
