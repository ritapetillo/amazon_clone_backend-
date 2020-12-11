const express = require("express");
const server = express();
const productsRoutes = require("./services/products");
const cors = require('cors')
const PORT = process.env.PORT || 3001;

//CONFIG
//enable cors
server.use(cors());
//going to make express able to read the body in json
server.use(express.json());

//ROUTES
//products
server.use("/products", productsRoutes);

//LISTEN
server.listen(PORT, () => console.log("server is running on", PORT));
