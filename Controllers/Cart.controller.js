const express = require("express");
const app = express();
app.use(express.json());

const CartCollection = require("../Models/Cart.model");
const ProductCollection = require("../Models/Product.model");
const {getUserfromJWT,isidValid} = require("../Services/validator.service.js");
const { AddToCartValidation, EditCartValidation,} = require("../Validators/Cart.validator");



/* Get cart by user id */
const GetCart = async (req, res) => {
  try {
    /* see if the user exist from the jwt header request and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;

    let cart = await CartCollection.findOne(user.Cart).populate('CartProducts.Product').exec();
    if(cart)
     res.send(cart);
    else 
     res.status(404).send('There is no cart assigned to this user id');
    
  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};


/* Add a Product To Cart */
const AddToCart = async (req, res) => {
  let { error, value } = await AddToCartValidation(req.body);
  if (error) return await res.status(400).send(error.details[0].message);

    try {
      /* get the user from jwt header and check it's validation */
      let user = await getUserfromJWT(req.headers.jwt, res);
      if (!user) return;

      let cart = await CartCollection.findOne(user.Cart).populate('CartProducts.Product').exec();

      /* if user enter invalid product id in the request */
      if (!isidValid(req.body.Product))
        return res.status(400).send("product id is invalid");

      let product = await ProductCollection.findById(value.Product).exec();
      if (!product)
        return res.status(404).send("there is no product exist with that id");

      /* if user enter quantity more than that existed in the stock */
      if (+product.productQuantity < +value.Quantity)
        return res.status(400).send("there is no enough quantity of this product in the stock");
      else {
        /* if product exist add quantity to the existed product in the cart */
        let existedproduct = cart.CartProducts.find((obj) =>(product._id).equals(obj.Product._id));

        if (existedproduct) {
          /* if product exist and quantity can be added increase the quantity not add new product */
            existedproduct.Quantity = +value.Quantity;

        } else {
          /* if product isn't exist add the product in the cart array */
          cart.CartProducts.push({
            Product: product._id,
            Quantity: value.Quantity,
          });
        }
        /* save the cart and send it to user */
        await cart.save();
        cart = await CartCollection.findOne(user.Cart).populate('CartProducts.Product').exec();
        await res.send(cart);
      }
    } catch (err) {
      res.status(400).send("sorry something went wrong");
    }
};

const AssignLocalCCart = async(req,res) =>{
  // try{

    let localcart = req.body;
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;
    let cart = await CartCollection.findOne(user.Cart).populate('CartProducts.Product').exec();
    
    for(let i=0;i<localcart.length;i++){
      
      let product = await ProductCollection.findById(localcart[i].Product._id).exec();
      if (!product || +product.productQuantity < +localcart[i].Quantity) continue;
      
      let existedproduct = cart.CartProducts.find((obj) =>(product._id).equals(obj.Product._id));
      /* if product exist and quantity can be added increase the quantity not add new product */
      if (existedproduct){
        existedproduct.Quantity = +localcart[i].Quantity;
  } else {
    /* if product isn't exist add the product in the cart array */
    cart.CartProducts.push({
      Product: product._id,
      Quantity: localcart[i].Quantity,
    });
  }
}

await cart.save();
await res.send('done')

// }catch(err){
//   res.status(400).send("sorry something went wrong");
// }
}

/* Edit a product in the Cart */
const EditCart = async (req, res) => {
  const { error, value } = EditCartValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    try {
      /* if user enter invalid product id in request paramter */
      if (!isidValid(req.params.id))
      return res.status(400).send("product id is invalid");
    
    let product = await ProductCollection.findById(req.params.id).exec();
      if (!product)
        return res.status(404).send("there is no product exist with that id");
      if (product.productQuantity < value.Quantity)
        return res.status(400).send("there is no enough quantity of this product in the stock");

      /* see if the user exist from the jwt header request and check it's validation */
      let user = await getUserfromJWT(req.headers.jwt, res);
      if (!user) return;
      
      let cart = await CartCollection.findOne(user.Cart).populate('CartProducts.Product').exec();
      if (cart) {
        let cartproduct = await cart.CartProducts
        .find((cartitem) => (cartitem.Product).equals(req.params.id));
        
        /* if the product exist in the cart update it */
        if (cartproduct) {
          cartproduct.Quantity = value.Quantity;
          cart.save();
          return res.send(cart);
        } 
        return res.status(404).send("there is no product exist with that id in your cart");

      } else {
        return res.status(404).send("There is no cart assigned to this user id");
      }
    } catch (err) {
      res.status(400).send("sorry something went wrong");
    }
  }
};


/* remove a product from the Cart */
const removefromCart = async (req, res) => {
  try {
    /* if user enter invalid product id in req paramter */
    if (!isidValid(req.params.id))
      return res.status(400).send("product id is invalid");

    let product = await ProductCollection.findById(req.params.id).exec();
    if (!product)
      return res.status(404).send("there is no product exist with that id");

    /* see if the user exist from the jwt header request and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;
    
    let cart = await CartCollection.findOne(user.Cart).populate('CartProducts.Product').exec();
    
    /* search the cart items for the product */
    if (cart) {
      let cartproduct = cart.CartProducts.find((cartitem) => cartitem.Product.equals(req.params.id));
      
      /* if the product exist remove it */
      if (cartproduct) {
        cart.CartProducts = cart.CartProducts.filter((obj) => !obj.Product.equals(req.params.id));
        cart.save();
        return res.send(cart);
      } else {
        return res.status(404).send("there is no product exist with that id in your cart");
      }

    } else {
      return res.status(404).send(`There is no cart assigned to this user id`);
    }
  } catch (err) {
    res.status(400).send("sorry something went wrong");
  }
};


/* remove all products from the cart */
const clearcart = async (req, res) => {
  try {
    /* see if the user exist from the jwt header request and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;

    let cart = await CartCollection.findOne(user.Cart).exec();
    if (cart) {
      cart.CartProducts = [];
      cart.save();
      res.send(cart);
    } else {
      res.status(404).send("There is no cart assigned to this user id");
    }
  } catch (err) {
    res.status(404).send("sorry something went wrong");
  }
};

module.exports = {
  GetCart,
  EditCart,
  AddToCart,
  removefromCart,
  AssignLocalCCart,
  clearcart,
};