const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const User = require('./src/models/UserModel');
const Post = require('./src/models/PostModel');
const userRouter = require('./src/routes/userRoutes');
const postRouter = require('./src/routes/postRoutes')
const { checkUser } = require('./middlewares/auth');

//creating app
const app = express()



//middleWares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());


//routes
app.use(checkUser);
app.get('/', async (req,res, next )=>{
    await Post.find({state:"published"}, (err, posts) => {
        if (err) {
            next(err)
        }
        else {

            res.jlcome to the home page", posts})
        }
}); //home route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.get('*', (req, res) => {
    res.status(404).json({ message: 'route not found' })
})


//errorHandling middleware
const errorHandler = require('./middlewares/error')
app.use(errorHandler);

module.exports = app