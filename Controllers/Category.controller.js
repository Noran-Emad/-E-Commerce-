const express = require("express");
const app = express();
app.use(express.json());

const CategoryCollection = require("../Models/Category.model");
const ProductCollection = require("../Models/Product.model");
const {isidValid} = require('../Services/validator.service');
const { CategoryEditValidation, CategoryValidation } = require("../Validators/Category.validator");
const { default: mongoose } = require("mongoose");



/* Get All categories */
const GetAllCategory = (req, res) =>
  CategoryCollection.find().select('-Products').then((Category) => res.send(Category));


/* Get products of category */
const GetCategory = async (req, res) => {
  try {
    if(!isidValid(req.params.id))
        return res.status(400).send('category id is invalid');

          let category = await CategoryCollection.findOne({_id: req.params.id});
          if (!category)
              return res.status(404).send('There is no Category with this id');
      
          let page = parseInt(req.query.page) || 1;
          let limit = parseInt(req.query.limit) || 30;
          let sort = req.query.sort || 'Discounted';

          let pipeline = [
              { $match: { CategoryID: new mongoose.Types.ObjectId(req.params.id),isDeleted: false }  },
              { $sort: getSortStage(sort) },
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $lookup: { from: 'reviews', localField: '_id', foreignField: 'Product', as: 'reviews' } },
              { $addFields: { AverageRating: { $avg: '$reviews.Rating' } } }
          ];
      
          let products = await ProductCollection.aggregate(pipeline);
          let totalCount = await ProductCollection.countDocuments({ CategoryID: req.params.id ,isDeleted: false});

          let totalPages = Math.ceil(totalCount / limit);
      
          res.send({ Category: category, Products: products, TotalPages: totalPages });


      

  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};

function getSortStage(sort) {
  switch (sort) {
      case 'Low':
          return { productPrice: 1 };
      case 'High':
          return { productPrice: -1 };
      case 'Discounted':
          return { Discount: -1 };
      case 'New':
          return { createdAt: -1 };
      default:
          return { Discount: -1 };
  }
}

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