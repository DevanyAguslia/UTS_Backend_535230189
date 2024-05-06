const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const carts = require('./components/carts/carts-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  carts(app);

  return app;
};
