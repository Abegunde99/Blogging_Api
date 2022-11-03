const jwt = require('jsonwebtoken');
const User = require('../src/models/UserModel')
const ErrorResponse = require('../utils/errorResponse');
require('dotenv').config()

const authenticate = (req, res, next) => {
    //get the token from the cookie

    const token = req.cookies.jwt;
    //verify if the token is present
    if (token) {
        //verify with jwt
        jwt.verify(token, process.env.JWT_SECRET , (err, decodedToken) => {
            if (err) {
                return next(new ErrorResponse('Not authorized to access this route', 401))
            } else {
                next()
            }
        })
    } else {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
}


const checkUser = (req,res,next) => {
    const token = req.cookies.jwt

    if (token) {
        //verify with jwt
        jwt.verify(token, process.env.JWT_SECRET , async (err, decodedToken) => {
            if (err) {
                return next(new ErrorResponse('invalid token', 401))
            }
            else {
                const id = decodedToken.id;
                const user = await User.findById(id);
                req.user = user;
                next()
            }
        })
    }
    else {
        next()
    }
}

//export
module.exports = { authenticate, checkUser };