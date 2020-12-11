const express = require("express");
const router = express.Router();
const { join } = require("path");
const {
  writeFileJSON,
  readFileJSON
} = require("../../lib/fsExtra.js");
const { check, validationResult } = require("express-validator");
const dbPath = join(__dirname, "categories.json");
const uniqid = require("uniqid");
const { writeFile } = require("fs");

//1. GET /categories -> get all categories
router.get("/", async (req, res, next) => {
  try {
    const arrayCategories = await readFileJSON(dbPath);
    res.status(200).send(arrayCategories);
  } catch (err) {
    next(err);
  }
});

//2. GET /categories/:id -> get category by ID
router.get("/:id", async (req, res, next) => {
  try {
    const arrayCategories = await readFileJSON(dbPath);
    const category = arrayCategories.find(
      (category) => category._id === req.params.id
    );
    if (!category) {
      const err = new Error();
      err.httpStatus = 404;
      next(err);
    } else {
      res.status(200).send(category);
    }
  } catch (err) {
    next(err);
  }
});

//3. POST /categories/ -> post a new category
router.post(
  "/",
  [
    check("name")
      .exists()
      .isString()
      .withMessage("Category name is mandatory and must be a string"),
  ],
  async (req, res, next) => {
    const newCategory = {
      ...req.body,
      _id: uniqid() + uniqid.time(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.httpStatus = 400;
      next(error);
    } else {
      try {
        const arrayCategories = await readFileJSON(dbPath);
        await arrayCategories.push(newCategory);
        await writeFileJSON(dbPath, arrayCategories);
        res.send(newCategory);
      } catch (err) {
        next(err);
      }
    }
  }
);

//4. PUT /categories/ -> modify a category
router.put(
  "/:id",
  [
    check("name")
      .exists()
      .isString()
      .withMessage("Category name is mandatory and must be a string"),
  ],
  async (req, res, next) => {
    const editedCategory = {
      ...req.body,
      updatedAt: Date.now(),
      _id: req.params.id,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.httpStatus = 400;
      next(error);
    } else {
      try {
        const arrayCategories = await readFileJSON(dbPath);
        const index = await arrayCategories.findIndex(
          (cat) => cat._id === req.params.id
        );
        if (index >= 0) {
          arrayCategories[index] = editedCategory;
          await writeFileJSON(dbPath, arrayCategories);
          res.send(editedCategory);
        } else {
          const err = new Error();
          err.httpStatus = 404;
          next(err);
        }
      } catch (err) {
        next(err);
      }
    }
  }
);

//5. DELETET /categories/:id -> modify a category
router.delete("/:id", async (req, res, next) => {
  try {
    const arrayCat = await readFileJSON(dbPath);
    const newArrayCat = await arrayCat.filter(
      (cat) => cat._id == !req.params.id
    );
    await writeFileJSON(dbPath, newArrayCat);
    res.send(newArrayCat);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
