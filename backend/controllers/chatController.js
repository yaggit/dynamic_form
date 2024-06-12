const { sequelize } = require("../config/db");
const { QueryTypes } = require('sequelize');

const generateRoomId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};
 
const createRoom = async (socket, roomInfo) => { 
  const { name, userId } = roomInfo;
  const roomId = generateRoomId();
  console.log('room info',roomInfo);
  
  try {
    await sequelize.query('INSERT INTO room SET name =?, room_id =?, user_id=?', {
      replacements: [name, roomId, userId],
      type: QueryTypes.INSERT
    });

    console.log(`Room created: ${name} (ID: ${roomId})`);
    socket.emit('roomCreated', {...roomInfo, id: roomId });

  } catch (err) {
    console.error('Error creating room:', err);
    socket.emit('error', { message: 'Failed to create room' });
  }
};

const getRoom = async (req, res) => {
  const id = req.params.id; 

  try {
    const room = await sequelize.query('SELECT * FROM room WHERE room_id =?', {
      replacements: [id],
      type: QueryTypes.SELECT
    });

    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ message: 'Failed to fetch room' });
  }
};


const chat = async(req,res) => {

  const{roomId, message, userName} = req.body

  try{
    await sequelize.query('INSERT INTO chat SET room_id =?, message = ?, username =?', {
      replacements: [roomId, message,userName],
      type: QueryTypes.INSERT
    });
    res.status(201).json({ message: 'Chat inserted' });
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Failed to insert chat' });
  }
}


const chatHistory = async (req, res) => {
  const roomId = req.params.id;

  try {
    const history = await sequelize.query('SELECT username,message FROM chat WHERE room_id =?', {
      replacements: [roomId],
      type: QueryTypes.SELECT
    });

    res.status(200).json({ history: history, message: 'Chat history fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};


const roomsByUserId = async(req,res) => {
  const userId = req.params.id;
  try {
    const rooms = await sequelize.query(`SELECT * FROM room WHERE user_id =?`, {
    replacements: [userId],
    type: QueryTypes.SELECT
  })
  res.status(200).json({ rooms, message: 'Rooms fetched successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch rooms' });
    } 
}

const submitForm = async(socket,formId) => {
  const id = formId;

  try{
    const [numberOfResponses] = await sequelize.query(`SELECT COUNT(form_id) FROM form_responses WHERE form_id = ?`, {
      replacements:[id],
      type: QueryTypes.SELECT
  });
  console.log(numberOfResponses)

socket.emit('submitForm', numberOfResponses)

 
  }catch(error){
    console.log(error)
  }
}

const sendChatMessage = async(socket, message) => {
  socket.broadcast.emit('newMessage', message);
  console.log(message);
};

const socketController =  (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on('createRoom', (roomInfo) => {
      createRoom(socket, roomInfo);
    });

    socket.on('submitForm', (formId) => {
      submitForm(socket,formId)
    });

    socket.on('chatMessage', (message) => {
      sendChatMessage(socket, message);
    });
  });
};


module.exports = { createRoom, getRoom, chat , chatHistory, socketController, roomsByUserId, submitForm};
