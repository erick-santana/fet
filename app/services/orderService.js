import Order from "../models/order.js"; 
import Product from "../models/product.js"; 
import braintree from "braintree"; 
import dotenv from "dotenv"; 
import sgMail from "@sendgrid/mail"; 


dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_KEY);


const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, 
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const getOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("products", "-photo")
    .populate("buyer", "name");

  res.json(orders);
};


export const allOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("products", "-photo")
    .populate("buyer", "name")
    .sort({ createdAt: "-1" });

  res.json(orders);
};

// Serviço para processar o pagamento via Braintree
export const processPaymentService = async (req, res) => {
  const { nonce, cart } = req.body; 

  let total = cart.reduce((acc, item) => acc + item.price, 0); 

  try {
    let result = await gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      const order = await new Order({
        products: cart,
        payment: result,
        buyer: req.user._id,
      }).save();

      decrementQuantity(cart);
      res.json({ ok: true });
    } else {
      res.status(500).send(result.message); 
    }
  } catch (error) {
    res.status(500).send(error.message); 
  }
};


const decrementQuantity = async (cart) => {
  const bulkOps = cart.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $inc: { quantity: -1, sold: +1 } },
    },
  }));

  const updated = await Product.bulkWrite(bulkOps);
  console.log("Estoque atualizado", updated);
};


export const orderStatusService = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate("buyer", "email name");

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: order.buyer.email,
    subject: "Atualização no Status do Pedido",
    html: `
      <h1>Olá ${order.buyer.name}, o status do seu pedido é: <span style="color:red;">${order.status}</span></h1>
      <p>Visite <a href="${process.env.CLIENT_URL}/dashboard/user/orders">seu painel</a> para mais detalhes.</p>
    `,
  };

  try {
    await sgMail.send(emailData);
  } catch (err) {
    console.log(err);
  }

  res.json(order);
};
