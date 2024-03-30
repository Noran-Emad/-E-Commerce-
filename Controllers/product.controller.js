const express = require("express");
const app = express();
app.use(express.json());

const { ProductEditValidation, ProductValidation, } = require("../Validators/Product.validator");
const ProductCollection = require("../Models/Product.model");
const CategoryCollection = require("../Models/Category.model");
const ReviewsCollection = require("../Models/Review.model");
const { isidValid } = require("../Services/validator.service");
const { default: mongoose } = require("mongoose");



/* Get All Products */
const GetAllProducts = async (req, res) => {

  try {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 2;
    let sort = req.query.sort || 'Recommended';

    let pipeline = [];

    switch (sort) {
      case 'Low':
        pipeline.push({ $sort: { productPrice: 1 } },{ $skip: (page - 1) * limit },{ $limit: limit });
        break;
      case 'High':
        pipeline.push({ $sort: { productPrice: -1 } },{ $skip: (page - 1) * limit },{ $limit: limit });
        break;
      case 'Discounted':
        pipeline.push({ $sort: { Discount: -1 } },{ $skip: (page - 1) * limit },{ $limit: limit });
        break;
      case 'New':
        pipeline.push({ $sort: { createdAt: -1 } },{ $skip: (page - 1) * limit },{ $limit: limit });
        break;
      default:
        pipeline.push({ $sort: { Discount: -1 } },{ $skip: (page - 1) * limit },{ $limit: limit });
    }

    pipeline.push(
      { $lookup: { from: 'reviews', localField: '_id', foreignField: 'Product', as: 'reviews'} },
      { $addFields: {  AverageRating: { $round: [{ $avg: '$reviews.Rating' }, 1] }} }
    );

    let products = await ProductCollection.aggregate(pipeline);
    let totalCount = await ProductCollection.countDocuments();
    let totalPages = Math.ceil(totalCount / limit);

    res.send({ Products: products, TotalPages: totalPages });

  } catch (err) {
    res.status(400).send("sorry something went wrong");
  }
}


/* Get Product */
const GetProduct = async (req, res) => {
  try {

    /* if user enters invalid product id in request paramter */
    if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");

    let product = await ProductCollection.findOne({ _id: req.params.id }).populate("CategoryID", "CategoryName").exec();

    if (!product) return res.status(404).send("There is no Product with id");

  
    let averageRatingPipeline = [
      {$match: { Product:new mongoose.Types.ObjectId(req.params.id) }},
      {$group: {_id: null,averageRating: { $avg: "$Rating" }}}
    ];

    let result = await ReviewsCollection.aggregate(averageRatingPipeline);
    let rate = result.length > 0 ? result[0].averageRating : 0;


     product = product.toObject(); 
     product.rate = rate;


    res.send(product);

  } catch (err) {
    res.status(400).send("sorry something went wrong");
  }
};


/* Add Product */
const AddProduct = async (req, res) => {
  let { error, value } = await ProductValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  else {
    try {

      /* if user enters invalid category id */
      if (!isidValid(req.body.CategoryID))
        return res.status(400).send("Category id is invalid");

      let category = await CategoryCollection.findById(req.body.CategoryID);
      if (!category)
        return res.status(400).send("there is no Category exist with that id");

      let createdproduct = await ProductCollection.create(req.body);

      await category.Products.push(createdproduct._id);
      await category.save();
      res.send(createdproduct);

    } catch (err) {
      res.status(400).send("sorry something went wrong");
    }
  }
};


/* Edit Product */
const EditProduct = async (req, res) => {
  let { error, value } = await ProductEditValidation(req.body);
  if (error) await res.status(400).send(error.details[0].message);
  else {
    try {
      /* if user enters invalid product id in request paramter */
      if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");

      let product = await ProductCollection.findOne({ _id: req.params.id }).populate("CategoryID").exec();

      if (!product) return res.status(404).send("There is no Product with id");
      let updatedproduct = await ProductCollection.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      res.send(updatedproduct);

    } catch (err) {
      res.status(400).send("sorry something went wrong");
    }
  }
};



/* Delete a Product */
const DeleteProduct = async (req, res) => {
  try {
    /* if user enters invalid product id in request paramter */
    if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");

    let product = await ProductCollection.findOne({ _id: req.params.id }).populate("CategoryID", "CategoryName").exec();

    if (!product) return res.status(404).send("There is no Product with id");
    await ProductCollection.findByIdAndDelete({ _id: req.params.id }, req.body);
    res.send(product);

  } catch (err) {
    res.status(400).send("sorry something went wrong");
  }
};


/* Search for Products */
const SearchForProducts = async (req, res) => {
  const { ProductName, CategoryName } = req.body;
  if (!ProductName && !CategoryName)
    return res
      .status(422)
      .send({ message: "Please enter ProductName or CategoryName" });

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
      return res
        .status(404)
        .send(`There are no products with the entered data`);
    }
    res.send(products);
  } catch (err) {
    res.status(500).send(`Internal Server Error`);
  }
};


module.exports = {
  GetAllProducts,
  GetProduct,
  AddProduct,
  EditProduct,
  SearchForProducts,
  DeleteProduct,
};