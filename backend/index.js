require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');


//middlewares

const corsOptions = {
    origin: "https://go-kart.onrender.com" // frontend URI (ReactJS)
}

server.use(cors(corsOptions));
server.use(cors({
    exposedHeaders:['X-Total-Count']
}))

server.use(express.static(path.resolve(__dirname,'build')));

server.use(express.json()); // to parse req.body
server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router)
server.use('/brands', brandsRouter.router)
server.use('/users', usersRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart', cartRouter.router)
server.use('/orders', ordersRouter.router)

main().catch(err=> console.log(err));



async function main(){
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected')
}

server.get('/',(req, res)=>{
    res.json({status:'success'})
})

// const password = encodeURIComponent('Rohit@08022002');

server.listen(process.env.PORT, ()=>{
    console.log('server started')
})
