const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/auth');
const fs = require('fs');
const path = require('path');
const passport = require('passport');


// const generateToken = (user) => {
//   const payload = { email: user.email, password: user.password, id: user.id, profile_pic: user.profile_pic, name: user.name };
//   return jwt.sign(payload, 'crud', { expiresIn: '24h' });
// };

const generateToken = (user) => {
  const payload = { email: user.email, password: user.password, id: user.id, profile_pic: user.profile_pic, name: user.name };
  return jwt.sign(payload, 'crud', { expiresIn: '24h' });
};


//  register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let profile_pic = null;
    if (req.files && req.files.profile_pic) {
      const profile_pic_file = req.files.profile_pic;
      const dirExists = fs.existsSync(`public/assets/`);
      if (!dirExists) {
        fs.mkdirSync(`public/assets/`, { recursive: true });
      }

      profile_pic = `/public/assets/${Date.now()}.${profile_pic_file.name.split(".").pop()}`;
      profile_pic_file.mv(path.join(__dirname, ".." + profile_pic), (err) => {
        if (err) throw new Error("Error in uploading profile picture");
      });
    } else if (req.body.profile_pic) {
      profile_pic = req.body.profile_pic;
    }

    const result = await sequelize.query(
      'INSERT INTO users (name, email, password, profile_pic) VALUES (?, ?, ?, ?)',
      {
        replacements: [name, email, hashedPassword, profile_pic],
        type: QueryTypes.INSERT
      }
    );

    res.json({ message: `User created!` });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [existingUser] = await sequelize.query('SELECT * FROM users WHERE email = ?',
      { replacements: [email], type: QueryTypes.SELECT });

    if (existingUser) {

      const user = existingUser;

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {

        const token = generateToken(user);
        const userId = user.id;

        return res.status(200).send({ message: 'Login success!', token: token, userId: userId });
      } else {
        return res.status(401).send({ message: 'Incorrect password!' });
      }
    } else {
      return res.status(404).send({ message: 'Email not found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in login check api!',
      error
    });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [existingUser] = await sequelize.query('SELECT * FROM users WHERE email = ?',
      { replacements: [email], type: QueryTypes.SELECT });

    if (!existingUser) {

      return res.status(404).send({ message: 'Email not found! Sign up!' });

    }

    else {

      const user = existingUser;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newPassword = await sequelize.query(`UPDATE users SET password = ? WHERE email= ?`, {
        replacements: [hashedPassword, email]
      })
      return res.status(200).send({ message: 'Password updated!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in login check api!',
      error
    });
  }
}


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  generateToken
}