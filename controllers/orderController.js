const User = require('../models/user');
const Order = require('../models/orders')
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const MERCHANT_ID = process.env.SENANGPAY_MERCHANT_ID;
const SECRET_KEY = process.env.SENANGPAY_SECRET_KEY;
//const PAYMENT_URL = 'https://sandbox.senangpay.my/payment/';
const PAYMENT_URL = `https://sandbox.senangpay.my/apiv1/payments`;

exports.createOrder = async (req,res,next)=>{
   // const { company_id, product_name, quantity, total_price } = req.body;
   const { company_id, product_name, quantity, total_price, card_number, card_expiry, cvv, name } = req.body;
    try {

        // Validate customer existence
        const customer = await User.findByPk(company_id);
        if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
    
        // Create the order
        const newOrder = await Order.create({
          company_id,
          product_name,
          quantity,
          total_price,
        });
         
        res.status(201).json({
          message: 'Order created successfully',
          order: newOrder,
        });

      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
      }
}

exports.payMent = async (req,res)=>{
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  // Payload Data
  const payload = {
    merchantID: "JT07",
    invoiceNo: "000005",
    description: "item 1",
    amount: 1000.00,
    currencyCode: "MYR",
    paymentChannel: ["CC"],
    backendReturnUrl:'http://localhost:5000/api/orders/paymentnotification',
    frontendReturnUrl:'https://staging.elliance-services.com/GEMConnect/index.html'
  };
  
  // Your secret key (replace this with your actual secret key)
  const secretKey = '9E936798778E8E21ABA8E7B620EF631E0C957BB1ADA14E4960022307A9726A09';
  
  // Generate the JWT Token
  const token = jwt.sign(payload, secretKey, { algorithm: 'HS256', header: header });


  
 // console.log("Generated JWT Token:", token);

  try {
    const response = await axios.post('https://sandbox-pgw.2c2p.com/payment/4.3/paymenttoken', {
      payload: token
    });
    console.log("response",response.data)
    const decodedToken = jwt.decode(response.data.payload);
    console.log("Decoded Token:", decodedToken);
    res.json(decodedToken);


} catch (error) {
    res.status(500).json({ error: error.message });
}

}

exports.paymetNotification = async (req,res)=>{
  const paymentInfo = req.body;

  // Example of the data you might expect from 2C2P's notification
  const { invoiceNo, paymentStatus, amount, transactionId } = paymentInfo;

  console.log('Payment Notification Received:', paymentInfo);

  // Process the payment info, e.g., update order status in your database
  if (paymentStatus === '00') { // '00' typically means the payment was successful
    // Update order status to 'paid'
    console.log(`Order ${invoiceNo} has been paid successfully.`);
    // Further processing (e.g., sending a confirmation email)
  } else {
    console.log(`Payment for Order ${invoiceNo} failed or is pending.`);
    // Handle payment failure or pending status
  }

  // Respond with a 200 status to acknowledge receipt of the notification
  res.json();
}

exports.iniTialpaymnet = async (req, res) => {
  const { name, email, phone, amount, order_id } = req.body;
  
  // Your SenangPay credentials
  const merchant_id = '280172120434922';
  const secret_key = '6875-691';

  // Create a hash for security
  const hash_string = crypto.createHash('sha256').update(merchant_id + secret_key + amount + order_id).digest('hex');
  console.log('hashstring',hash_string)
  // SenangPay payment URL
  // const senangPayURL = `https://sandbox.senangpay.my/payment/${merchant_id}`;

  // // Redirect to SenangPay payment pagehttps://sandbox.senangpay.my/payment
  // res.redirect(`${senangPayURL}?name=${name}&email=${email}&phone=${phone}&amount=${amount}&order_id=${order_id}&hash=${hash_string}`);
 // const senangPayURL = `https://sandbox.senangpay.my/payment/${merchant_id}?name=${name}&email=${email}&phone=${phone}&amount=${amount}&order_id=${order_id}&hash=${hash_string}`;

  // Send the URL back to the frontend
  res.json({ url: senangPayURL });
};