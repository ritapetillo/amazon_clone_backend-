const express = require("express");
const router = express.Router();
const { join } = require("path");
const { writeFileJSON, readFileJSON } = require("../../lib/fsExtra.js");
const dbPath = join(__dirname, "products.json");
const uniqid = require('uniqid')

//1. GET /products -> get all products
router.get("/", async (req, res, next) => {
  try {
    let arrayProducts = await readFileJSON(dbPath);
    if(req.query.category){
        const {category} = req.query;
        const products = arrayProducts.filter(product=>product.category === category)
        res.send(products)
    } else{
    if (arrayProducts) {
      res.status(200).send(arrayProducts);
    } else {
      //Handle error here
      // let err = new Error();
      console.log("there is an error");
    }}
  } catch (err) {
    //Handle error here
    console.log(err);
  }
});

//2. GET /products/:id -> get product by ID
router.get('/:id', async(req,res,next)=>{
    try{
        const {id} = req.params;
        const arrayProducts = await readFileJSON(dbPath)
        const product = arrayProducts.find(product=>product._id ===id)
        if (product){
            res.send(product)
        } else{
            //error hendeler
            const err = new Error()
            err.httpStatusCode = 404
            console.log(err)
            
        }
    } catch(err){
        //error handler
        console.log(err)
    }
})


//3. POST /products -> post a product
router.post('/',async(req,res,next)=>{
    const newProduct = {
        ...req.body,
        cratedAt: Date.now(),
        updatedAt: Date.now(),
        _id: uniqid() + uniqid.time()
    }
    try{
        const arrayProducts = await readFileJSON(dbPath)
        await arrayProducts.push(newProduct)
        writeFileJSON(dbPath,arrayProducts)
        res.send(newProduct)
    } catch(err){
        //error handler
        console.log(err)
    }

})

//4. PUT /products/:id -> edit a product by ID

//5. DELETE products/:id -> delete a product by ID

//EXTRA
//6. GET products/:category -> get all products by category
router.get('/category/:category', async(req,res,next)=>{
    try{
        const {category} = req.params;
        const arrayProducts = await readFileJSON(dbPath)
        const product = arrayProducts.filter(product=>product.category ===category)
        if (product){
            res.send(product)
        } else{
            //error hendeler
            const err = new Error()
            err.httpStatusCode = 404
            console.log(err)
            
        }
    } catch(err){
        //error handler
        console.log(err)
    }
})

module.exports = router;
