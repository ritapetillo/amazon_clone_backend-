const express = require("express");
const router = express.Router();
const { join } = require("path");
const {
  writeFileJSON,
  readFileJSON,
  writeFileImage,
} = require("../../lib/fsExtra.js");
const dbPath = join(__dirname, "products.json");
const uniqid = require("uniqid");
const { readJSON } = require("fs-extra");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const e = require("express");
const uploadMw = multer();
const pathImages = join(__dirname, "../../public/products/img");

//1. GET /products -> get all products
router.get("/", async (req, res, next) => {
  try {
    let arrayProducts = await readFileJSON(dbPath);
    if (req.query.category) {
      const { category } = req.query;
      const products = arrayProducts.filter(
        (product) => product.category === category
      );
      res.send(products);
    } else {
      if (arrayProducts) {
        res.status(200).send(arrayProducts);
      } else {
        //Handle error here
        const err = new Error();
        err.httpStatusCode = 404;
        next(err);
      }
    }
  } catch (err) {
    //Handle error here
    next(err);
  }
});

//2. GET /products/:id -> get product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const arrayProducts = await readFileJSON(dbPath);
    const product = arrayProducts.find((product) => product._id === id);
    if (product) {
      res.send(product);
    } else {
      //error hendeler
      const err = new Error();
      err.httpStatusCode = 404;
      console.log(err);
    }
  } catch (err) {
    //error handler
    next(err);
  }
});

//3. POST /products -> post a product
router.post(
  "/",
  [
    check("name")
      .exists()
      .isString()
      .withMessage("Product name is required and must be a string"),
    check("description")
      .exists()
      .isString()
      .withMessage("Product description is required and must be a string"),
    check("brand")
      .exists()
      .isString()
      .withMessage("Product brand is required and must be a string"),
    check("price")
      .exists()
      .isNumeric()
      .withMessage("Product price is required and must be a number"),
    check("category")
      .isString()
      .withMessage("Product catgory must be a string"),
  ],
  async (req, res, next) => {
    const newProduct = {
      ...req.body,
      cratedAt: Date.now(),
      updatedAt: Date.now(),
      _id: uniqid() + uniqid.time(),
    };

    const errors = validationResult(req);
    if (!errors.isEmpty) {
      const err = new Error();
      err.httpStatusCode = 400;
      next(err);
    } else {
      try {
        const arrayProducts = await readFileJSON(dbPath);
        await arrayProducts.push(newProduct);
        writeFileJSON(dbPath, arrayProducts);
        res.send(newProduct);
      } catch (err) {
        //error handler
        next(err);
      }
    }
  }
);

//4. PUT /products/:id -> edit a product by ID
router.put(
  "/:id",
  [
    check("name")
      .exists()
      .isString()
      .withMessage("Product name is required and must be a string"),
    check("description")
      .exists()
      .isString()
      .withMessage("Product description is required and must be a string"),
    check("brand")
      .exists()
      .isString()
      .withMessage("Product brand is required and must be a string"),
    check("price")
      .exists()
      .isNumeric()
      .withMessage("Product price is required and must be a number"),
    check("category")
      .isString()
      .withMessage("Product catgory must be a string"),
  ],
  async (req, res, next) => {
    const editedProduct = {
      ...req.body,
      updatedAt: Date.now(),
      _id: req.params.id,
    };
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      const err = new Error();
      err.httpStatusCode = 400;
      next(err);
    } else {
      try {
        const arrayProducts = await readFileJSON(dbPath);
        const indexProduct = arrayProducts.findIndex(
          (product) => product._id === req.params.id
        );
        if (indexProduct >= 0) {
          arrayProducts[indexProduct] = editedProduct;
          writeFileJSON(dbPath, arrayProducts);
          res.send(editedProduct);
        } else {
          const err = new Error();
          err.httpStatusCode = 404;
          next(err);
        }
      } catch (err) {
        next(err);
      }
    }
  }
);

//5. DELETE products/:id -> delete a product by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const arrayProducts = await readJSON(dbPath);
    const newArrayProducts = arrayProducts.filter(
      (product) => product._id !== req.params.id
    );
    writeFileJSON(dbPath, newArrayProducts);
    res.send(newArrayProducts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//6. GET products/:category -> get all products by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    const arrayProducts = await readFileJSON(dbPath);
    const product = arrayProducts.filter(
      (product) => product.category === category
    );
    if (product) {
      res.send(product);
    } else {
      //error hendeler
      const err = new Error();
      err.httpStatusCode = 404;
      console.log(err);
    }
  } catch (err) {
    //error handler
    console.log(err);
  }
});

//7.POST products/:id/upload -> get all products by category
router.post("/:id/upload", uploadMw.single("image"), async (req, res, next) => {
  const image = req.file.buffer;
  try {
    await writeFileImage(
      join(pathImages, `${req.file.originalname}.jpeg`),
      req.file.buffer
    );
    const arrayProducts = await readJSON(dbPath);
    const productIndex = arrayProducts.findIndex(
      (product) => product._id === req.params.id
    );
    const product = arrayProducts.find(
      (product) => product._id === req.params.id
    );

    if (productIndex >= 0) {
      product.imageUrl = `${req.file.originalname}.jpeg`;
      arrayProducts[productIndex] = product;
      res.send(product);
    } else {
      const err = new Error();
      err.httpStatusCode = 400;
      next(err);
    }
  } catch (err) {
      console.log(err)
      next(err);
      
  }
});

module.exports = router;
