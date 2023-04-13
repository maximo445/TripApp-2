const express = require('express');

const {
    getAllUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
} = require('../controllers/userController');

const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.patch('/updatePassword/', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, updateMe);
router.delete('/deleteMe', authController.protect, deleteMe);


router.route('/')
    .get(getAllUsers)
    .post(addUser);

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;