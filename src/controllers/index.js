const category = require('./category.controller')
const product = require('./product.controller')
const payment = require('./payment.controller')
const auth = require('./auth.controller')
module.exports = {
  category,
  product,
  payment,
  auth,
}