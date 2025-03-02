const express = require('express');
const path = require('path');
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const cartRouter = require('./routes/cartRoutes')
const orderRouter = require('./routes/orderRoutes')
const cookieParser = require('cookie-parser');

const app = express();

const cors = require('cors')
app.use( cors({ origin: 'https://gentle-brioche-25624d.netlify.app', 
credentials: true }) );

app.use(cookieParser())
//Serve Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('Hello World')
})

module.exports = app;