'use strict';

const container = require('./api/boot');

exports.register = function(server, options, next) {
  require('./api/user')(server, container);
  next();
};

exports.register.attributes = {
  name: 'voice-api-routes',
  version: '1.0.0'
};
