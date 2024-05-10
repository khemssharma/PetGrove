const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMailer");
const sendToken = require("../utils/jwtToken.js");
const Shop = require("../models/shop");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendShopToken = require("../utils/ShopJwtToken.js");

// create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "1d", // token expires in 1 day
    });
};

router.post("/create-shop", upload.single("file"), async (req, res, next) => {
    try {
        const { email } = req.body;
        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error deleting the file" });
                }
            });
            return next(new ErrorHandler("User already exists", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const seller = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        const activationToken = createActivationToken(seller);
        const activationUrl = `${process.env.SERVER}/seller/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate your shop`
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Activate user
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newSeller) {
            return next(new ErrorHandler("Invalid token", 400));
        }

        const { name, email, password, avatar, address, zipCode, phoneNumber } = newSeller;
        let seller = await Shop.findOne({ email });

        if (seller) {
            return next(new ErrorHandler("User already exists", 400));
        }

        seller = await Shop.create({ name, email, avatar, password, address, zipCode, phoneNumber });
        sendShopToken(seller, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

//Login Shop

router.post(
    "/shop-login",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { email, password } = req.body;
  
        if (!email || !password) {
          return next(new ErrorHandler("Please provide the all fields!", 400));
        }
  
        const seller = await Shop.findOne({ email }).select("+password");
  
        if (!seller) {
          return next(new ErrorHandler("User doesn't exists!", 400));
        }
  
        const isPasswordValid = await seller.comparePassword(password);
  
        if (!isPasswordValid) {
          return next(
            new ErrorHandler("Please provide the correct information", 400)
          );
        }
  
        sendShopToken(seller, 201, res);
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

  //Load Shop

  router.get("/getseller", isSeller, catchAsyncErrors(async(req, res, next)=>{
    try{
        const seller = await Shop.findById(req.seller.id);

        if(!seller){
            return next(new ErrorHandler("Seller doesn't exists", 400));
        }

        res.status(200).json({
            success: true,
            seller,
        });

    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
  }))

module.exports = router;
