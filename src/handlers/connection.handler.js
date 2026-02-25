const logger = require('../utils/logger');
const userService = require('../services/user.service');
const messageHandler = require('./message.handler');
const roomHandler = require('./room.handler');


const handleConnection = (io, socket) => {
  logger.info(`New connection: ${socket.id}`);
  
  socket.emit('connected', {
    socketId: socket.id,
    message: 'Successfully connected to server',
    timestamp: new Date().toISOString(),
  });
  
  socket.on('register', (data, callback) => {
    try {
      const { username } = data;
      
      if (!username || username.trim().length === 0) {
        const error = { error: 'Username is required' };
        if (callback) callback(error);
        return;
      }
      
      if (username.length > 20) {
        const error = { error: 'Username must be 20 characters or less' };
        if (callback) callback(error);
        return;
      }
      
      if (userService.isUsernameTaken(username)) {
        const error = { error: 'Username is already taken' };
        if (callback) callback(error);
        return;
      }
      
      const user = userService.addUser(socket.id, username);
      
      logger.success(`User registered: ${username} (${socket.id})`);
      
      const response = {
        success: true,
        user: {
          socketId: user.socketId,
          username: user.username,
          joinedAt: user.joinedAt,
        },
      };
      
      if (callback) callback(response);
      
      io.emit('user_connected', {
        username: user.username,
        userCount: userService.getUserCount(),
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      logger.error('Error in register event:', error);
      if (callback) callback({ error: 'Registration failed' });
    }
  });
  
  socket.on('join_room', (data, callback) => {
    roomHandler.handleJoinRoom(io, socket, data, callback);
  });
  
  socket.on('leave_room', (data, callback) => {
    roomHandler.handleLeaveRoom(io, socket, data, callback);
  });
  
  socket.on('get_room_users', (data, callback) => {
    roomHandler.handleGetRoomUsers(socket, data, callback);
  });
  

  socket.on('get_rooms', (callback) => {
    roomHandler.handleGetRooms(callback);
  });
  

  socket.on('send_message', (data, callback) => {
    messageHandler.handleSendMessage(io, socket, data, callback);
  });
  

  socket.on('private_message', (data, callback) => {
    messageHandler.handlePrivateMessage(io, socket, data, callback);
  });
  

  socket.on('typing', (data) => {
    messageHandler.handleTyping(io, socket, data);
  });
  

  socket.on('stop_typing', (data) => {
    messageHandler.handleStopTyping(io, socket, data);
  });
  

  socket.on('get_message_history', (data, callback) => {
    messageHandler.handleGetMessageHistory(socket, data, callback);
  });
  

  socket.on('disconnect', (reason) => {
    logger.info(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
    
    const user = userService.getUser(socket.id);
    
    if (user) {
      const userRooms = userService.getUserRooms(socket.id);
      
      userRooms.forEach((roomName) => {
        io.to(roomName).emit('user_left', {
          username: user.username,
          room: roomName,
          timestamp: new Date().toISOString(),
        });
        
        const usersInRoom = userService.getUsersInRoom(roomName);
        io.to(roomName).emit('room_users', {
          room: roomName,
          users: usersInRoom.map(u => ({
            socketId: u.socketId,
            username: u.username,
          })),
        });
      });
      
      userService.removeUser(socket.id);
      
      io.emit('user_disconnected', {
        username: user.username,
        userCount: userService.getUserCount(),
        timestamp: new Date().toISOString(),
      });
      
      logger.info(`User ${user.username} disconnected and cleaned up`);
    }
  });
  

  socket.on('error', (error) => {
    logger.error(`Socket error on ${socket.id}:`, error);
  });
  
  
  socket.on('ping', (callback) => {
    if (callback) {
      callback({ pong: true, timestamp: new Date().toISOString() });
    }
  });
};

module.exports = handleConnection;