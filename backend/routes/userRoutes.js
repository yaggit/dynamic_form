const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, googlePassport, generateToken } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');
const { createRoom, getRoom, chat, chatHistory, roomsByUserId } = require('../controllers/chatController');
const passport = require('passport');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');


// Register new user 
router.post('/users/register', registerUser);

// login
router.post('/users/login', loginUser);

//fogot password
router.post('/users/forgotPassword', forgotPassword)


router.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      console.log(req.user);

      if (req.user) {
        const [existingUser] = await sequelize.query(
          `SELECT * FROM users WHERE email=? AND login_type = ?`,
          {
            replacements: [req.user.email, 'google'],
            type: QueryTypes.SELECT
          }
        );

        if (existingUser) {
          res.redirect('http://localhost:3000/dashboard');
        } else {
  
          await sequelize.query(
            `INSERT INTO users (name, email, profile_pic, login_type) VALUES (?, ?, ?, ?)`,
            {
              replacements: [req.user.name, req.user.email, req.user.picture, 'google'],
              type: QueryTypes.INSERT
            }
          );

          res.redirect('http://localhost:3000/dashboard');
        }
      } else {
    
        console.error('No user found ');
        res.status(401).send(' authentication failed');
      }
    } catch (error) {
      console.error('Errorcallback:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);


//chat routes
router.post('/room', verifyToken, createRoom)

router.get('/getRoom/:id', getRoom)

router.post('/chat', chat)

router.get('/chatHistory/:id', chatHistory)

router.get('/roomsByUser/:id', roomsByUserId)

module.exports = router