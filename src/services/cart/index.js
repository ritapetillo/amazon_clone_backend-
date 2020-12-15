const express = require("express");
const router = express.Router();
const { join } = require("path");
const { writeFileJSON, readFileJSON } = require("../../lib/fsExtra.js");
const { check, validationResult } = require("express-validator");
const uniqid = require("uniqid");
const { runInNewContext } = require("vm");
const cartDbDir = join(__dirname, "cart.json");
const productDbDir = join(__dirname, "../products/products.json");

// POST /carts/{cartId}/add-to-cart/{productId}
router.post("/:cartID/add-to-cart/:productID", async (req, res, next) => {
  const { cartID, productID } = req.params;

  try {
    const arrayCarts = await readFileJSON(cartDbDir);
    const arrayProducts = await readFileJSON(productDbDir);

    const selectedCart = await arrayCarts.find((cart) => cart._id === cartID);
    const selectedProdcut = await arrayProducts.find(
      (prod) => prod._id === productID
    );
    if (selectedCart) {
      selectedCart.products.push(selectedProdcut);
      selectedCart.total = selectedCart.products.reduce(
        (acc, prod) => acc + Number(prod.price),
        0
      );

      try {
        await writeFileJSON(cartDbDir, arrayCarts);
        res.status(200).send(selectedCart);
      } catch (err) {
        next(err);
      }
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

//  - You need to be able to retrieve those products in the Cart page, therefore creating the endpoint for it in the BE, and display them accordingly.

//  GET /carts/{cartId}
router.get("/:cartID", async (req, res, next) => {
  const { cartID } = req.params;
  try {
    const arrayCarts = await readFileJSON(cartDbDir);
    const selectedCart = arrayCarts.find((cart) => cart._id === cartID);
    if (selectedCart) {
      res.status(200).send(selectedCart);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});
//  - Add the functionality to remove items from the Cart.

//  DELETE /carts/{cartid}/remove-from-cart/{productId}
router.delete(
  "/:cartID/remove-from-cart/:productID",
  async (req, res, next) => {
    const { cartID, productID } = req.params;

    try {
      const arrayCarts = await readFileJSON(cartDbDir);
      const arrayProducts = await readFileJSON(productDbDir);

      const selectedCart = await arrayCarts.find((cart) => cart._id === cartID);
      const selectedProdcut = await arrayProducts.find(
        (prod) => prod._id === productID
      );

      const indexProductToDelete = selectedCart.products.findIndex(
        (product) => selectedProdcut
      );

      if (selectedCart && indexProductToDelete != -1) {
        selectedCart.products = selectedCart.products.filter(
          (prod, index) => index !== indexProductToDelete
        );
        selectedCart.total = selectedCart.products.reduce(
          (acc, prod) => acc + Number(prod.price),
          0
        );

        await writeFileJSON(cartDbDir, arrayCarts);
        res.send(selectedProdcut);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
