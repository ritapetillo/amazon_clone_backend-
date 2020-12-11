const express = require("express");
const router = express.Router();
const { join } = require("path");
const { writeFileJSON, readFileJSON } = require("../../lib/fsExtra.js");
const dbPath = join(__dirname, "products.json");

//1. GET /products -> get all products
router.get("/", async (req, res, next) => {
  try {
    let arrayProducts = await readFileJSON(dbPath);
    if (arrayProducts) {
      res.status(200).send(arrayProducts);
    } else {
      //Handle error here
      // let err = new Error();
      console.log("there is an error");
    }
  } catch (err) {
    //Handle error here
    console.log(err);
  }
});

//2. GET /products/:id -> get product by ID

//3. POST /products -> post a product

//4. PUT /products/:id -> edit a product by ID

//5. DELETE products/:id -> delete a product by ID

//EXTRA
//6. GET products/:categoryID -> get all products by category

module.exports = router;
