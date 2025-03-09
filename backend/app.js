require('dotenv').config({ path: './config/.env' }); 

const express = require('express');
const ErrorHandler = require('./middleware/error');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./controller/user');
const shop = require('./controller/shop');
const product = require('./controller/product');
const event = require('./controller/event');
const coupon = require('./controller/couponCode');
const payment = require('./controller/payment');
const order = require('./controller/order');
const conversation = require('./controller/conversation');
const messages = require('./controller/messages');

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path: ".env"
    })
}
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true,
}));
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: true}));


if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
    path:"backend/config/.env"
}); 
}

// Import routes
app.use("/api/v1/user", user);
app.use("/api/v1/shop", shop);
app.use("/api/v1/product", product);
app.use("/api/v1/event", event);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/payment", payment); 
app.use("/api/v1/order", order); 
app.use("/api/v1/conversation", conversation); 
app.use("/api/v1/messages", messages); 

// Error handling
app.use(ErrorHandler);
 
module.exports = app;
