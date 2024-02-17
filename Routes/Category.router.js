const express = require("express")
const router = express.Router();
const { GetAllCategory, GetCategory, AddCategory, EditCategory, DeleteCategory } = require('../Controllers/Category.controller');

router.post('/',AddCategory);

router.get('/',GetAllCategory);

router.get('/:id',GetCategory);

router.patch('/:id',EditCategory);

router.delete('/:id',DeleteCategory);

module.exports = router;