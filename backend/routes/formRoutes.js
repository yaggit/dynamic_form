const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { createForm, getAllForms, getFormById, formSubmit, editForm, deleteForm, allResponsesById, sendMail, responseNumber } = require('../controllers/formController');
const nodemailer = require('nodemailer');
const { sendPDF } = require('../controllers/pdfController');


//all forms
router.get('/allForms', verifyToken, getAllForms)
 
//create form
router.post('/createForm', verifyToken ,createForm)

//get form by id
router.get('/form/:id', getFormById)

//submit user form
router.post('/submitForm', formSubmit)

//edit form data
router.put('/editform/:id', editForm)

//delete form
router.delete('/deleteForm/:id', deleteForm)

//all deatails reponses
router.get('/allResponsesById/:id', allResponsesById)


router.post('/sendMail', sendMail)

router.post('/sendPdf', sendPDF)


module.exports = router; 