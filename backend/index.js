require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");

//middlewares

const corsOptions = {
  origin: ["https://buzz-basket-front.vercel.app", "http://localhost:5173"], // Add frontend origins
  credentials: true, // Allow cookies and credentials
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  exposedHeaders: ["X-Total-Count"], // Expose custom headers like X-Total-Count
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "build")));

app.use('/products', (req, res, next) => {
    const allowedOrigins = ["https://buzz-basket-front.vercel.app", "http://localhost:5173"];
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Handle preflight (OPTIONS) requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200); // Preflight request response
    }
  
    next();
  });

// to parse req.body
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter.router);
app.use("/brands", brandsRouter.router);
app.use("/users", usersRouter.router);
app.use("/auth", authRouter.router);
app.use("/cart", cartRouter.router);
app.use("/orders", ordersRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database connected");
}

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
