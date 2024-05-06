const cartsRepository = require('./carts-repository');
//get list of carts
async function getCarts() {
  const carts = await cartsRepository.getCarts();
  const results = [];
  for (let i = 0; i < carts.length; i += 1) {
    const cart = carts[i];
    results.push({
      id: cart.id,
      product_id: cart.product_id,
      product_name: cart.product_name,
      quantity: cart.quantity
    });
  }
  return results;
}
//get cart detail
async function getCart(id) {
  const cart = await cartsRepository.getCart(id);
  if (!cart) {
    return null;
  }
  return {
    id: cart.id,
    product_id: cart.product_id,
    product_name: cart.product_name,
    quantity: cart.quantity
  };
}
//create cart
async function createCart(product_id, product_name, quantity) {
  try {
    await cartsRepository.createCart(product_id, product_name, quantity);
  } catch (err) {
    return null;
  }
  return true;
}

//update cart
async function updateCart(id, product_id, product_name, quantity) {
  const cart = await cartsRepository.getCart(id);

  if (!cart) {
    return null;
  }
  try {
    await cartsRepository.updateCart(id, product_id, product_name, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

//delete cart
async function deleteCart(id) {
  const cart = await cartsRepository.getCart(id);
  if (!cart) {
    return null;
  }

  try {
    await cartsRepository.deleteCart(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
};
