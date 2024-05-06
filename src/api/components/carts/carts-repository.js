const { Cart } = require('../../../models');

//get list of cart
async function getCarts() {
  return Cart.find({});
}

//get cart detail
async function getCart(id) {
  return Cart.findById(id);
}
//create cart
async function createCart(product_id, product_name, quantity) {
  return Cart.create({product_id, product_name, quantity});
}
//update cart
async function updateCart(id, product_id, product_name, quantity) {
  return Cart.updateOne(
    {
      _id: id,
    },
    {
      $set: {product_id, product_name, quantity},
    }
  );
}
//delete cart
async function deleteCart(id) {
  return Cart.deleteOne({ _id: id });
}

module.exports = {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
};
