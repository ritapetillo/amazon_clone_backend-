
const express = require("express");
const server = express();
const productsRoutes = require("./services/products");
const {
    catchAll,
    unauthorized,
    forbidden,
    notFound,
} = require("./errorHandler")
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

// Error section (Damn that's fast)

server.use(unauthorized)
server.use(forbidden)
server.use(notFound)
server.use(catchAll)
//LISTEN
server.listen(PORT, () => console.log("server is running on", PORT));
