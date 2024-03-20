const express = require("express");
const app = express();
app.use(express.json());

const CategoryCollection = require("../Models/Category.model");
const ProductCollection = require("../Models/Product.model");
const {isidValid} = require('../Services/validator.service');
const { CategoryEditValidation, CategoryValidation } = require("../Validators/Category.validator");



/* Get All categories */
const GetAllCategory = (req, res) =>
  CategoryCollection.find().select('-Products').then((Category) => res.send(Category));


/* Get products of category */
const GetCategory = async (req, res) => {
  try {
    if(!isidValid(req.params.id))
        return res.status(400).send('category id is invalid');

    let category = await CategoryCollection.findOne({_id:req.params.id}).select('-Products').exec();
        if(!category)
        return res.status(404).send('There is no Category with this id');

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 30;
    let sort = req.query.sort || 'Recommended';
    
    let SortedProducts;
    switch(sort){
      case 'Low':
        SortedProducts = await ProductCollection.find({CategoryID:req.params.id}).sort({productPrice:1}).limit(limit).skip((page-1) * limit);
        break;
      case 'High':
        SortedProducts = await ProductCollection.find({CategoryID:req.params.id}).sort({productPrice:-1}).limit(limit).skip((page-1) * limit);
        break;
      case 'Discounted':
        SortedProducts = await ProductCollection.find({CategoryID:req.params.id}).sort({Discount:-1}).limit(limit).skip((page-1) * limit);
        break;
      case 'New':
        SortedProducts = await ProductCollection.find({CategoryID:req.params.id}).sort({ createdAt: -1 }).limit(limit).skip((page-1) * limit);
        break;
      default:
        SortedProducts = await ProductCollection.find({CategoryID:req.params.id}).sort({Discount:-1}).limit(limit).skip((page-1) * limit);
    }
  
    let totalCount =  await ProductCollection.find({CategoryID:req.params.id}).countDocuments();
    let TotalPages = Math.ceil(totalCount/limit);
  
   res.send({Category:category,Products:SortedProducts,TotalPages:TotalPages});

  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};


/* Add Category */
const AddCategory = async (req, res) => {
  let { error, value } = await CategoryValidation(req.body);
  if (error) return await res.status(400).send(error.details[0].message);

    try {
        /* check if the category exist */
        let isCategoryExist = await CategoryCollection.findOne({CategoryName : req.body.CategoryName}).exec();
        if(isCategoryExist) return res.status(400).send('This Category is already exist');
        
        let createdcategory = await CategoryCollection.create(req.body);
        res.send(createdcategory);
        } catch (err) {
        res.status(400).send("sorry something went wrong");
    }
};


/* Edit a Category */
const EditCategory = async (req, res) => {
  let { error, value } = await CategoryEditValidation(req.body);
  if (error) return await res.status(400).send(error.details[0].message);

    try {
      if(!isidValid(req.params.id))
          return res.status(400).send('category id is invalid');

      let updatedcategory = await CategoryCollection.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      if(!updatedcategory) return res.status(400).send('There is no category with this id');

      res.send(updatedcategory);
    }
    catch (err) {
      res.status(400).send("sorry something went wrong");
    }
};


/* Delete a Category */
const DeleteCategory = async (req, res) => {
  try {
    if(!isidValid(req.params.id))
        return res.status(400).send('category id is invalid');

    let category = await CategoryCollection.findOne({ _id: req.params.id });
    if(!category) return res.status(404).send('There is no category with this id');

    await CategoryCollection.deleteOne(category);

    res.send(category);
  }
  catch (err) {
    res.status(400).send("sorry something went wrong");
  }
};

module.exports = {
  GetAllCategory,
  GetCategory,
  AddCategory,
  EditCategory,
  DeleteCategory
};