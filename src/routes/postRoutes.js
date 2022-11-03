const express = require('express');
const router = express.Router({ mergeParams: true});
const passport = require('passport');
const { authenticate, checkUser } = require('../../middlewares/auth');


const {
    getAllPost,
    getPost,
    createPost,
    updatePost,
    deletePost,
    updateState,
} = require('../controllers/postControllers');


router.get('/', getAllPost);
router.get('/:id', getPost);
router.post('/create', authenticate, createPost);
router.put('/edit/:id', authenticate, updatePost);
router.put('/state/:id', authenticate, updateState);
router.delete('/delete/:id', authenticate, deletePost);

module.exports = router;
