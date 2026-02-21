const logger = require('../utils/logger');

const messageHistory = new Map();

const MAX_MESSAGES_PER_ROOM = 100;

const createMessage = (username, content, roomName = null, type = 'room') => {
  return {
    id: generateMessageId(),
    username,
    content,
    roomName,
    type,
    timestamp: new Date(),
  };
};

const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const saveMessage = (roomName, message) => {
  if (!messageHistory.has(roomName)) {
    messageHistory.set(roomName, []);
  }
  
  const messages = messageHistory.get(roomName);
  messages.push(message);
  
  if (messages.length > MAX_MESSAGES_PER_ROOM) {
    messages.shift();
  }
  
  logger.debug(`Message saved to room ${roomName}`);
};

const getMessageHistory = (roomName, limit = 50) => {
  if (!messageHistory.has(roomName)) {
    return [];
  }
  
  const messages = messageHistory.get(roomName);
  
  return messages.slice(-limit);
};

const getRecentMessages = (limit = 20) => {
  const allMessages = [];
  
  for (const messages of messageHistory.values()) {
    allMessages.push(...messages);
  }
  
  allMessages.sort((a, b) => b.timestamp - a.timestamp);
  
  return allMessages.slice(0, limit);
};

const clearRoomHistory = (roomName) => {
  messageHistory.delete(roomName);
  logger.debug(`Message history cleared for room ${roomName}`);
};

const clearAllHistory = () => {
  messageHistory.clear();
  logger.debug('All message history cleared');
};

const getTotalMessageCount = () => {
  let count = 0;
  for (const messages of messageHistory.values()) {
    count += messages.length;
  }
  return count;
};

const getRoomMessageCount = (roomName) => {
  if (!messageHistory.has(roomName)) {
    return 0;
  }
  return messageHistory.get(roomName).length;
};

const searchMessages = (query, roomName = null) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  const searchInRoom = (messages) => {
    return messages.filter((message) =>
      message.content.toLowerCase().includes(lowerQuery)
    );
  };
  
  if (roomName && messageHistory.has(roomName)) {
    const messages = messageHistory.get(roomName);
    results.push(...searchInRoom(messages));
  } else {
    for (const messages of messageHistory.values()) {
      results.push(...searchInRoom(messages));
    }
  }
  
  return results;
};

const formatMessage = (message) => {
  return {
    id: message.id,
    username: message.username,
    content: message.content,
    timestamp: message.timestamp.toISOString(),
    type: message.type,
  };
};

const createSystemMessage = (content, roomName) => {
  return createMessage('System', content, roomName, 'system');
};

module.exports = {
  createMessage,
  saveMessage,
  getMessageHistory,
  getRecentMessages,
  clearRoomHistory,
  clearAllHistory,
  getTotalMessageCount,
  getRoomMessageCount,
  searchMessages,
  formatMessage,
  createSystemMessage,
};