const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)         //Read
    .post(usersController.createNewUser)      //Create
    .patch(usersController.updateUser)        //Update
    .delete(usersController.deleteUser)       //Delete

module.exports = router;