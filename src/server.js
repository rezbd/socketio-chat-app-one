/**
 * Main Server File
 * 
 * Sets up Express server and Socket.IO
 * Serves static files and handles Socket.IO connections
 */

const express = require('express');
const http = require('http');
const path = require('path');
const { initializeSocket } = require('./config/socket.config');
const connectionHandler = require('./handlers/connection.handler');
const logger = require('./utils/logger');

const app = express();

const server = http.createServer(app);

const io = initializeSocket(server);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


app.get('/api/stats', (req, res) => {
  // Get all connected sockets
  const sockets = io.sockets.sockets;
  const connectedUsers = sockets.size;
  
  res.json({
    connectedUsers,
    timestamp: new Date().toISOString(),
  });
});


io.on('connection', (socket) => {
  // Delegate connection handling to connection handler
  connectionHandler(io, socket);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Express error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Start server
server.listen(PORT, () => {
  logger.success(`Server is running on http://${HOST}:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('Socket.IO is ready for connections');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server, io };