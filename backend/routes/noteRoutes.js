const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

router.route('/')
    .get(notesController.getAllNotes)         //Read
    .post(notesController.createNewNote)      //Create
    .patch(notesController.updateNote)        //Update
    .delete(notesController.deleteNote)       //Delete

module.exports = router;