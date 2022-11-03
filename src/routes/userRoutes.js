const express = require('express');
const router = express.Router();
const passport = require('passport')

const {
    login,
    signup,
    logout,
    deleteUser
} = require('../controllers/userControllers');

//using resource routes
const postRouter = require('./postRoutes');

//rerouting to post routes
router.use('/:id/posts', postRouter);

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.delete('/delete/:id', deleteUser)

module.exports = router;