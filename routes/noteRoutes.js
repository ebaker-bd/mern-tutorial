const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.route('/')
    .get(notesController.getAllNotes)         //Read
    .post(notesController.createNewNote)      //Create
    .patch(notesController.updateNote)        //Update
    .delete(notesController.deleteNote)       //Delete

module.exports = router;