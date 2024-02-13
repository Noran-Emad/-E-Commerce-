const express = require("express");
const { ProductEditValidation, ProductValidation } = require("../Validators/Product.validator");
const ProductCollection = require("../Models/Product.model");
const CategoryCollection = require("../Models/Category.model");
const app = express();
app.use(express.json());

/* Get All */
const GetAllProducts = (req, res) =>
  ProductCollection.find().then((products) => res.send(products));

/* Get a Product */
const GetProduct = async (req, res) => {
  try {
    await ProductCollection.find({ _id: req.params.id }).then((product) =>{
      product.populate('Category')
      res.send(product)
    });
  } catch (err) {
    res.status(404).send(`There is no Product with id: ${req.params.id}`);
  }
};

/* Post Product */
const AddProduct = async (req, res) => {
  let { error, value } = await ProductValidation(req.body);
  if (error) {
    res.statusCode = 400;
    await res.send(error.details[0].message);
  } else {
    try{
      let category = await CategoryCollection.findById( req.body.CategoryID );
      let createdproduct = await ProductCollection.create(req.body);
       await category.Products.push(createdproduct._id);
        await category.save();
        res.send(req.body);
    }catch(err){
      res.status(400).send('there is no Category exist with that id');
    }
  }
};

/* Edit a Product */
const EditProduct = async (req, res) => {
  let { error, value } = await ProductEditValidation(req.body);
  if (error) await res.status(400).send(error.details[0].message);
  else {
    try {
      await ProductCollection.updateOne({ _id: req.params.id }, req.body);
      await ProductCollection.find({ _id: req.params.id }).then((product) =>res.send(product));
    } 
    catch (err) {
      res.status(404).send(`There is no Product with id: ${req.params.id}`);
    }
  }
};

/* Search for Products */
const SearchForProducts = async (req, res) => {
  const { ProductName, CategoryName } = req.body;
  if (!ProductName && !CategoryName)
    return res.status(422).send({ message: "Please enter ProductName or CategoryName" });

  try {
    let products = [];

    // Search by Product name 
      if (ProductName) {
      const product = await ProductCollection.findOne({ ProductName });
      if (product) {
        products.push(product);
      }
    }

    // Search by category name
    if (CategoryName) {
      const category = await CategoryCollection.findOne({ CategoryName });
      if (category) {
        products = products.concat(category.Products);
      }
    }

    // If no products found
    if (products.length == 0) {
      return res.status(404).send(`There are no products with the entered data`);
    }
    res.send(products);
  } catch (err) {
    res.status(500).send(`Internal Server Error`);
  }
};

/* Delete a Product */
const DeleteProduct = async (req, res) => {
   ProductCollection.findById({ _id: req.params.id }).exec().then(() => {
    ProductCollection.findByIdAndDelete({ _id: req.params.id }).exec();
    GetAllProducts(req, res);
}).catch(err => {
    res.status(404).send(`There is No Product with id ${req.params.id}`);
})
};


/* Delete All Products */
const DeleteAllProduct = async (req, res) => {
  ProductCollection.deleteMany().exec().then(() => {
   GetAllProducts(req, res);
}).catch(err => {
   res.status(404).send(`There is No Product with id ${req.params.id}`);
})

};

module.exports = {
  GetAllProducts,
  GetProduct,
  AddProduct,
  EditProduct,
  SearchForProducts,
  DeleteProduct,
  DeleteAllProduct
};
