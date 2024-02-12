const express = require("express")
const router = express.Router();
const { GetAllCategory, GetCategory, AddCategory, EditCategory, DeleteCategory } = require('../Controllers/Category.controller');

router.get('/',GetAllCategory);

router.get('/:id',GetCategory);

router.post('/',AddCategory);

router.patch('/:id',EditCategory);

router.delete('/:id',DeleteCategory);

module.exports = router;