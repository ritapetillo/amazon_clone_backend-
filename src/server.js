const express = require("express");
const server = express();
const productsRoutes = require("./services/products");
const reviewsRoutes = require("./services/reviews");

const catRoutes = require("./services/categories");
const cartsRoutes = require("./services/cart");

const {
  catchAll,
  unauthorized,
  forbidden,
  notFound,
  badRequestHandler,
} = require("./errorHandler");

const whiteList = [process.env.FE_DEV_URI, process.env.PE_PROD_URI];
const cors = require("cors");
const { join } = require("path");
const PORT = process.env.PORT || 3001;
const pathStatic = join(__dirname, "/public");

//CONFIG
//enable cors
server.use(
  cors({
    origin: (origin, cb) => {
      if (whiteList.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new Error("Not Allower by CORS"));
      }
    },
  })
);
//going to make express able to read the body in json
server.use(express.json());
//I tell express which folder to use for static files
server.use(express.static(pathStatic));

//ROUTES
//products
server.use("/products", productsRoutes);
//reviews
server.use("/reviews", reviewsRoutes);

server.use("/categories", catRoutes);
server.use("/carts", cartsRoutes);

// Error section (Damn that's fast)

server.use(unauthorized);
server.use(forbidden);
server.use(notFound);
server.use(badRequestHandler);
server.use(catchAll);
//LISTEN
server.listen(PORT, () => console.log("server is running on", PORT));
