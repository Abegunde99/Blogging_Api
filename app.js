const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const User = require('./src/models/UserModel');
const userRouter = require('./src/routes/userRoutes');
const postRouter = require('./src/routes/postRoutes')
const { checkUser } = require('./middlewares/auth');

//creating app
const app = express()



//middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());


//routes
app.use(checkUser);
app.get('/', (req,res )=>{res.send('Welcome to my blog')}); //home route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.get('*', (req, res) => {
    res.status(404).json({ message: 'route not found' })
})


//errorHandling middleware
const errorHandler = require('./middlewares/error')
app.use(errorHandler);

module.exports = app