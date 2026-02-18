
const logger = require('../utils/logger');


const users = new Map();

const rooms = new Map();


const addUser = (socketId, username) => {
  const user = {
    socketId,
    username,
    joinedAt: new Date(),
    rooms: new Set(),
  };
  
  users.set(socketId, user);
  logger.debug(`User added: ${username} (${socketId})`);
  
  return user;
};


const removeUser = (socketId) => {
  const user = users.get(socketId);
  
  if (user) {
    user.rooms.forEach((roomName) => {
      removeUserFromRoom(socketId, roomName);
    });
    
    users.delete(socketId);
    logger.debug(`User removed: ${user.username} (${socketId})`);
    return user;
  }
  
  return null;
};


const getUser = (socketId) => {
  return users.get(socketId) || null;
};

const getUserByUsername = (username) => {
  for (const [socketId, user] of users) {
    if (user.username === username) {
      return user;
    }
  }
  return null;
};


const getAllUsers = () => {
  return Array.from(users.values());
};


const addUserToRoom = (socketId, roomName) => {
  const user = users.get(socketId);
  
  if (!user) {
    logger.warn(`Cannot add user to room: User ${socketId} not found`);
    return false;
  }
  

  user.rooms.add(roomName);
  

  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set());
  }
  

  rooms.get(roomName).add(socketId);
  
  logger.debug(`User ${user.username} joined room: ${roomName}`);
  return true;
};


const removeUserFromRoom = (socketId, roomName) => {
  const user = users.get(socketId);
  
  if (!user) {
    return false;
  }
  

  user.rooms.delete(roomName);
  
  if (rooms.has(roomName)) {
    rooms.get(roomName).delete(socketId);
    
    if (rooms.get(roomName).size === 0) {
      rooms.delete(roomName);
      logger.debug(`Room ${roomName} is empty and has been deleted`);
    }
  }
  
  logger.debug(`User ${user.username} left room: ${roomName}`);
  return true;
};


const getUsersInRoom = (roomName) => {
  if (!rooms.has(roomName)) {
    return [];
  }
  
  const socketIds = Array.from(rooms.get(roomName));
  return socketIds
    .map((socketId) => users.get(socketId))
    .filter((user) => user !== undefined);
};


const getAllRooms = () => {
  return Array.from(rooms.keys());
};


const getUserRooms = (socketId) => {
  const user = users.get(socketId);
  return user ? Array.from(user.rooms) : [];
};


const isUsernameTaken = (username) => {
  return getUserByUsername(username) !== null;
};


const getUserCount = () => {
  return users.size;
};


const getRoomCount = () => {
  return rooms.size;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserByUsername,
  getAllUsers,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  getAllRooms,
  getUserRooms,
  isUsernameTaken,
  getUserCount,
  getRoomCount,
};