const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const cartsControllers = require('./carts-controller');
const cartsValidator = require('./carts-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/carts', route);

  // Get list of carts
  route.get('/', authenticationMiddleware, cartsControllers.getCarts);

  // Create cart
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(cartsValidator.createCart),
    cartsControllers.createCart
  );

  // Get cart detail
  route.get('/:id', authenticationMiddleware, cartsControllers.getCart);

  // Update cart
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(cartsValidator.updateCart),
    cartsControllers.updateCart
  );

  // Delete cart
  route.delete('/:id', authenticationMiddleware, cartsControllers.deleteCart);
};
