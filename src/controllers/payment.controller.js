const dollarsToCents = require("dollars-to-cents");
const { Order } = require("../model");
const { createUserConfirmationOrderEmail, createAdminConfirmationOrderEmail } = require("./mail.controller");
const { sum } = require("ramda");
const stripe = require("stripe")(process.env.STRIPE_SK_TEST);

const createPaymentIntent = async (
  { body: { fullname, address, phone, email, products } },
  res
) => {
  try {
    if (!address) {
      throw new Error("Адрес обязателен");
    }

    const amount = sum(products.map((p) => Number(p.price)));
    const productsIds = products.map(({ _id }) => _id);
    const prepareOrder = {
      fullname,
      address,
      phone,
      email,
      products: productsIds,
      amount,
    };
    const newOrder = await new Order(prepareOrder);
    const saveOrder = await newOrder.save();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: dollarsToCents(amount),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        orderId: String(saveOrder._id),
      },
    });
    return res.status(200).send({ paymentIntent, saveOrder });
  } catch (error) {
    res.status(500).send(error);
  }
};

const stripeWebHook = async ({ body }, res) => {
  try {
    const orderId = body.data.object.metadata.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found')
    }
    await Order.findOneAndUpdate(orderId, { $set: { status: 'Paid' } })
    createUserConfirmationOrderEmail(order);
    createAdminConfirmationOrderEmail(order);
    return res.status(200).send("SUCCESS");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createPaymentIntent,
  stripeWebHook,
};
