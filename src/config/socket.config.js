/**
 * Socket.IO Configuration
 * 
 * Centralized configuration for Socket.IO server
 * including CORS, connection settings, and event handlers
 */

const logger = require('../utils/logger');

/**
 * Socket.IO server options
 * These options configure how Socket.IO behaves
 */
const socketConfig = {
  // CORS configuration - allows connections from different origins
  cors: {
    origin: process.env.CLIENT_URL || '*', // Allow all origins in development
    methods: ['GET', 'POST'],
    credentials: true,
  },
  
  // Connection state recovery - recovers connections after brief disconnections
  connectionStateRecovery: {
    // Maximum duration of recovery (in ms)
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    // Skip middlewares when recovering
    skipMiddlewares: true,
  },
  
  // Ping timeout - time to wait for pong response before closing connection
  pingTimeout: 60000, // 60 seconds
  
  // Ping interval - how often to send ping packets
  pingInterval: 25000, // 25 seconds
  
  // Upgrade timeout - time to wait for transport upgrade
  upgradeTimeout: 10000, // 10 seconds
  
  // Max HTTP buffer size - maximum size of HTTP long-polling message
  maxHttpBufferSize: 1e6, // 1 MB
  
  // Allow upgrades - whether to allow transport upgrades
  allowUpgrades: true,
  
  // Transport options - which transports to allow
  transports: ['websocket', 'polling'],
  
  // Allow EIO3 - backward compatibility with Socket.IO v2
  allowEIO3: false,
};

/**
 * Initialize Socket.IO with HTTP server
 * 
 * @param {object} httpServer - HTTP server instance
 * @returns {object} Socket.IO server instance
 */
const initializeSocket = (httpServer) => {
  const { Server } = require('socket.io');
  
  // Create Socket.IO server with configuration
  const io = new Server(httpServer, socketConfig);
  
  logger.info('Socket.IO server initialized with configuration');
  
  // Middleware example - runs before connection event
  io.use((socket, next) => {
    logger.debug(`Connection attempt from ${socket.handshake.address}`);
    
    // You can add authentication logic here
    // For example, verify JWT token from socket.handshake.auth
    
    // Allow connection to proceed
    next();
  });
  
  // Return the configured Socket.IO instance
  return io;
};

/**
 * Get Socket.IO namespace
 * Namespaces allow you to split your application into multiple logical parts
 * 
 * @param {object} io - Socket.IO server instance
 * @param {string} namespaceName - Name of the namespace (default: '/')
 * @returns {object} Namespace instance
 */
const getNamespace = (io, namespaceName = '/') => {
  return io.of(namespaceName);
};

module.exports = {
  socketConfig,
  initializeSocket,
  getNamespace,
};