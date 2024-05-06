const joi = require('joi');

module.exports = {
  createCart: {
    body: {
      product_id: joi.string().min(1).max(100).required().label('Product ID'),
      product_name: joi.string().min(1).max(100).required().label('Product Name'),
      quantity: joi.number().required().label('quantity'),
    },
  },

  updateCart: {
    body: {
      product_id: joi.string().min(1).max(100).required().label('Product ID'),
      product_name: joi.string().min(1).max(100).required().label('Product Name'),
      quantity: joi.number().required().label('quantity'),
    },
  },
};
