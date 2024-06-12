const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/auth');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
    }
});


//create form
const createForm = async (req, res) => {
    const { title, description, questions, options } = req.body;
    const userId = req.user.id;

    try {
        const createFormQuery = await sequelize.query(
            `INSERT INTO forms (user_id,title,description) VALUES (?,?,?)`, {
                replacements: [userId, title, description],
                type: QueryTypes.INSERT
            }
        );

        const formId = createFormQuery[0];

        await Promise.all(questions.map(async (question) => {
            const optionsJson = question.options ? JSON.stringify(question.options) : null;
            await sequelize.query(
                `INSERT INTO form_fields (form_id, type, value, options) VALUES (?,?,?,?)`, {
                    replacements: [formId, question.type, question.value, optionsJson],
                    type: QueryTypes.INSERT
                }
            );
        }));        

        res.status(200).send("Form created successfully");
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).send("Internal server error");
    }
};

  
const getAllForms = async (req, res) => {
    try {
        
        const userId = req.user.id

        const allFormData = await sequelize.query(`SELECT * FROM forms WHERE user_id = ?`, {
            replacements: [userId],
            type: QueryTypes.SELECT
        });
    
        res.status(200).json(allFormData);

    } catch (error) {
        
        console.error('Error fetching all forms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getFormById = async (req,res) => {
    try {
     
        const { id } = req.params;

        const formData = await sequelize.query(
            `SELECT forms.id, 
            forms.title, 
            forms.description, 
            form_fields.form_id, 
            form_fields.type, 
            form_fields.value, 
            form_fields.options 
            FROM forms
            JOIN form_fields ON forms.id = form_fields.form_id 
            WHERE forms.id = ?`,
            {
                replacements: [id],
                type: QueryTypes.SELECT
            }
        );
    
        if (formData.length > 0) {
            res.status(200).json(formData);
        } else {
    
            res.status(404).json({ error: 'Form not found' });
        }
    } catch (error) {
  
        console.error('Error fetching form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//user submit form
const formSubmit = async (req, res) => {
    try {
        const formData = req.body;

        const { email, formId, ...responses } = formData;

        const replacements = Object.entries(responses).map(([questionIndex, response]) => [
           formId,
           email, 
            parseInt(questionIndex) + 1, 
            JSON.stringify(response)
        ]);

        await sequelize.query(`INSERT INTO form_responses (form_id, user_email, question_id, response_data) VALUES ?`, {
            replacements: [replacements]
        });

        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//editing form

const editForm = async (req,res) => {
    try{

        const {type, value, options} = req.body;
        const form_id = req.params.id

        const editForm = await sequelize.query(`UPDATE form_fields SET type=?,value=?,options=? WHERE form_id = ?`, {
            replacements: [ type, value, options, form_id]
        })

        console.log(editForm)

    }catch(error){
        console.error('Error editing form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteForm = async(req,res) => {
    try{
        const form_id = req.params.id

        const deleteForm = await sequelize.query(`DELETE FROM forms WHERE id=?`, {
            replacements: [form_id]
        })
    }catch(error){
        console.error('Error deleting form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const allResponsesById = async(req,res) => {
    try{
  
        const formId = req.params.id
        console.log(formId)
        const allResponses = await sequelize.query(`SELECT * FROM form_responses WHERE form_id = ?`, {
            replacements:[formId],
            type: QueryTypes.SELECT
        });
    
        res.status(200).json(allResponses);
  
    }catch(error){
        console.error('Error fetching user response by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

  
  const sendMail = async (req, res) => {
    const { email, formId, ...responses} = req.body;

    const replacements = Object.entries(responses).map(([questionIndex, response]) => `
        <li><strong>Question ${parseInt(questionIndex) + 1}:</strong> ${JSON.stringify(response)}</li>
    `);

    let htmlContent = `
        <p>Thank you for submitting the form!</p>
        <h2>Form Response:</h2>
        <ul>${replacements.join('')}</ul>
    `;

    const mailOptions = {
        from: '',
        to: email,
        subject: 'Form Submission Confirmation',
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Form submitted and email sent successfully');
        }
    });
};


module.exports = { createForm, getAllForms, getFormById, formSubmit, editForm, deleteForm , allResponsesById, sendMail}