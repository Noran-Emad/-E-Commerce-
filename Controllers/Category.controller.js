const express = require("express");
const { CategoryEditValidation, CategoryValidation } = require("../Validators/Category.validator");

const CategoryCollection = require("../Models/Category.model");
const app = express();
app.use(express.json());


/* Get All */
const GetAllCategory = (req, res) =>
  CategoryCollection.find().then((Category) => res.send(Category));

/* Get a Category */
const GetCategory = async (req, res) => {
  try {
   let cat = await CategoryCollection.findById( req.params.id ).populate('Products');
    res.send(cat)
  } catch (err) {
    res.status(404).send(`There is no Category with id: ${req.params.id}`);
  }
};



/* Post Category */
const AddCategory = async (req, res) => {
  let { error, value } = await CategoryValidation(req.body);
  if (error) {
    await res.status(400).send(error.details[0].message);
  } else {
    try {
      await CategoryCollection.create(req.body);
      await GetAllCategory(req, res);
    } catch (err) {
      res.status(500).send(`Error with creating Category: ${err}`);
    }
  }
};

/* Edit a Category */
const EditCategory = async (req, res) => {
  let { error, value } = await CategoryEditValidation(req.body);
  if (error) await res.status(400).send(error.details[0].message);
  else {
    try {
      await CategoryCollection.updateOne({ _id: req.params.id }, req.body);
      await CategoryCollection.find({ _id: req.params.id }).then((Category) =>res.send(Category));
    } 
    catch (err) {
      res.status(404).send(`There is no Category with id: ${req.params.id}`);
    }
  }
};

/* Delete a Category */
const DeleteCategory = async (req, res) => {
   CategoryCollection.findById({ _id: req.params.id }).exec().then(() => {
    CategoryCollection.findByIdAndDelete({ _id: req.params.id }).exec();
    GetAllCategory(req, res);
}).catch(err => {
    res.status(404).send(`There is No Category with id ${req.params.id}`);
})

};

module.exports = {
  GetAllCategory,
  GetCategory,
  AddCategory,
  EditCategory,
  DeleteCategory
};