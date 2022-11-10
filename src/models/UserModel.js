const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema
const ErrorResponse = require('../../utils/errorResponse'); 

const userSchema = new Schema({
    first_name: {
        type: String,
        // required: true,
    },
    last_name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        //using the isEmail function of from the validator to validate the email passed
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required:  [true, 'Please enter your password'],
        minlength: [6, 'minimum length of password is 6 characters']
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

//function to be called before a user is created
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//creating a static method on the schema
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user
        }
        throw new ErrorResponse('invalid credentials', 401)
    }
    throw new ErrorResponse('invalid credentials', 401);
}

module.exports = mongoose.model('User', userSchema);