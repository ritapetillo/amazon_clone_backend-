const express = require("express");
const server = express();
const productsRoutes = require("./services/products");
const PORT = process.env.PORT || 3001;

server.use("/products", productsRoutes);

server.listen(PORT, () => console.log("server is running on", PORT));
