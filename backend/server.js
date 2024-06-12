const express = require('express');
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const server = http.createServer(app);
const session = require('express-session');
const { testConnection } = require('./config/db');
require('./middlewares/googleAuth');
// const {  googleCallback } = require('./controllers/userController');
const formRoutes = require('./routes/formRoutes');
const userRoutes = require('./routes/userRoutes');
const { socketController } = require('./controllers/chatController');
const socketIo = require('socket.io');
const passport = require('passport');

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(cors());
app.use(fileUpload());

app.use(session({
  secret: process.env.AUTH_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use("/public/assets", express.static(__dirname + '/public/assets'));

testConnection()
  .then(() => {

    app.use('/', userRoutes);
    app.use('/', formRoutes);

    const io = socketIo(server, {
      cors: {
        origin: '*',
      },
    });
    socketController(io);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to start server:', err);
  });
