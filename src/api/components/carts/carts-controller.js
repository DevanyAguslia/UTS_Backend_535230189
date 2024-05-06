const cartsService = require('./carts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

//get list of carts
async function getCarts(request, response, next) {
  try {
    const carts = await cartsService.getCarts();
    return response.status(200).json(carts);
  } catch (error) {
    return next(error);
  }
}
//get cart detail
async function getCart(request, response, next) {
  try {
    const cart = await cartsService.getCart(request.params.id);

    if (!cart) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown Data');
    }
    return response.status(200).json(cart);
  } catch (error) {
    return next(error);
  }
}

//create cart
async function createCart(request, response, next) {
  try {
    const {product_id, product_name, quantity} = request.body;

    const success = await cartsService.createCart(product_id, product_name, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create data'
      );
    }

    return response.status(200).json({ product_id, product_name, quantity, message: "Cart created!" });
  } catch (error) {
    return next(error);
  }
}
//update cart
async function updateCart(request, response, next) {
  try {
    const {id} = request.params;
    const {product_id, product_name, quantity} = request.body;
    const success = await cartsService.updateCart(id, product_id, product_name, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update data'
      );
    }

    return response.status(200).json({product_id, product_name, quantity, message: "Data updated" });
  } catch (error) {
    return next(error);
  }
}
//delete cart
async function deleteCart(request, response, next) {
  try {
    const {id} = request.params;

    const success = await cartsService.deleteCart(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete data'
      );
    }

    return response.status(200).json({  message: "Data deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
};
