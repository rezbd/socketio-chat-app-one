/**
 * Message Service
 * 
 * Manages message storage and retrieval
 * In production, messages would be stored in a database
 */

const logger = require('../utils/logger');

/**
 * Message storage
 * Format: Map<roomName, Array<message>>
 */
const messageHistory = new Map();

/**
 * Maximum messages to store per room
 */
const MAX_MESSAGES_PER_ROOM = 100;

/**
 * Create a message object
 * 
 * @param {string} username - Sender's username
 * @param {string} content - Message content
 * @param {string} roomName - Room name (optional, for private messages use null)
 * @param {string} type - Message type: 'room', 'private', 'system'
 * @returns {object} Message object
 */
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

/**
 * Generate unique message ID
 * 
 * @returns {string} Unique message ID
 */
const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Save a message to history
 * 
 * @param {string} roomName - Room name
 * @param {object} message - Message object
 */
const saveMessage = (roomName, message) => {
  if (!messageHistory.has(roomName)) {
    messageHistory.set(roomName, []);
  }
  
  const messages = messageHistory.get(roomName);
  messages.push(message);
  
  // Keep only the last MAX_MESSAGES_PER_ROOM messages
  if (messages.length > MAX_MESSAGES_PER_ROOM) {
    messages.shift(); // Remove oldest message
  }
  
  logger.debug(`Message saved to room ${roomName}`);
};

/**
 * Get message history for a room
 * 
 * @param {string} roomName - Room name
 * @param {number} limit - Maximum number of messages to return
 * @returns {Array} Array of messages
 */
const getMessageHistory = (roomName, limit = 50) => {
  if (!messageHistory.has(roomName)) {
    return [];
  }
  
  const messages = messageHistory.get(roomName);
  
  // Return the last 'limit' messages
  return messages.slice(-limit);
};

/**
 * Get recent messages across all rooms
 * 
 * @param {number} limit - Maximum number of messages to return
 * @returns {Array} Array of recent messages
 */
const getRecentMessages = (limit = 20) => {
  const allMessages = [];
  
  for (const messages of messageHistory.values()) {
    allMessages.push(...messages);
  }
  
  // Sort by timestamp (newest first)
  allMessages.sort((a, b) => b.timestamp - a.timestamp);
  
  return allMessages.slice(0, limit);
};

/**
 * Clear message history for a room
 * 
 * @param {string} roomName - Room name
 */
const clearRoomHistory = (roomName) => {
  messageHistory.delete(roomName);
  logger.debug(`Message history cleared for room ${roomName}`);
};

/**
 * Clear all message history
 */
const clearAllHistory = () => {
  messageHistory.clear();
  logger.debug('All message history cleared');
};

/**
 * Get total message count
 * 
 * @returns {number} Total number of stored messages
 */
const getTotalMessageCount = () => {
  let count = 0;
  for (const messages of messageHistory.values()) {
    count += messages.length;
  }
  return count;
};

/**
 * Get message count for a room
 * 
 * @param {string} roomName - Room name
 * @returns {number} Number of messages in the room
 */
const getRoomMessageCount = (roomName) => {
  if (!messageHistory.has(roomName)) {
    return 0;
  }
  return messageHistory.get(roomName).length;
};

/**
 * Search messages by content
 * 
 * @param {string} query - Search query
 * @param {string} roomName - Room name (optional, searches all rooms if not provided)
 * @returns {Array} Array of matching messages
 */
const searchMessages = (query, roomName = null) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  const searchInRoom = (messages) => {
    return messages.filter((message) =>
      message.content.toLowerCase().includes(lowerQuery)
    );
  };
  
  if (roomName && messageHistory.has(roomName)) {
    // Search in specific room
    const messages = messageHistory.get(roomName);
    results.push(...searchInRoom(messages));
  } else {
    // Search in all rooms
    for (const messages of messageHistory.values()) {
      results.push(...searchInRoom(messages));
    }
  }
  
  return results;
};

/**
 * Format message for sending to client
 * Removes sensitive data and formats timestamps
 * 
 * @param {object} message - Message object
 * @returns {object} Formatted message
 */
const formatMessage = (message) => {
  return {
    id: message.id,
    username: message.username,
    content: message.content,
    timestamp: message.timestamp.toISOString(),
    type: message.type,
  };
};

/**
 * Create a system message
 * System messages are automated messages (user joined, left, etc.)
 * 
 * @param {string} content - Message content
 * @param {string} roomName - Room name
 * @returns {object} System message object
 */
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