# Socket.IO Chat Application

A real-time chat application built with Socket.IO and Node.js, demonstrating the core concepts and capabilities of WebSocket communication.

## 🎯 Learning Objectives

This project covers:
- Real-time bidirectional communication with Socket.IO
- Event-driven architecture
- Room-based messaging
- Connection management
- Broadcasting and targeted messaging
- Clean separation of concerns

## 🚀 Features

- Real-time messaging
- Multiple chat rooms
- User presence (online/offline)
- Typing indicators
- Private messaging
- Message history
- Clean and modular architecture

## 📁 Project Structure

```
socketio-chat-app/
├── src/
│   ├── server.js              # Express and Socket.IO server setup
│   ├── config/
│   │   └── socket.config.js   # Socket.IO configuration
│   ├── handlers/
│   │   ├── connection.handler.js    # Connection events
│   │   ├── message.handler.js       # Message events
│   │   └── room.handler.js          # Room events
│   ├── services/
│   │   ├── user.service.js          # User management
│   │   └── message.service.js       # Message management
│   └── utils/
│       └── logger.js                # Logging utility
├── public/
│   ├── index.html             # Chat UI
│   ├── css/
│   │   └── style.css          # Styles
│   └── js/
│       └── client.js          # Client-side Socket.IO logic
├── package.json
└── README.md
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd socketio-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. For development with auto-reload:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📚 Socket.IO Concepts Demonstrated

### 1. **Bidirectional Communication**
- Server can push data to clients
- Clients can emit events to server
- Real-time updates without polling

### 2. **Events**
- Custom event emitters and listeners
- Built-in events (connect, disconnect)
- Event acknowledgments

### 3. **Rooms**
- Grouping sockets for targeted broadcasting
- Join/leave room functionality
- Room-specific messaging

### 4. **Broadcasting**
- Emit to all connected clients
- Emit to all except sender
- Emit to specific rooms

### 5. **Namespaces**
- Logical separation of concerns
- Multiple endpoints on same connection

## 🔧 API Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ room: string, username: string }` | Join a chat room |
| `leave_room` | `{ room: string }` | Leave a chat room |
| `send_message` | `{ room: string, message: string }` | Send message to room |
| `typing` | `{ room: string, username: string }` | User is typing |
| `stop_typing` | `{ room: string, username: string }` | User stopped typing |
| `private_message` | `{ to: string, message: string }` | Send private message |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `user_joined` | `{ username: string, room: string }` | User joined room |
| `user_left` | `{ username: string, room: string }` | User left room |
| `receive_message` | `{ username: string, message: string, timestamp: number }` | New message received |
| `user_typing` | `{ username: string }` | User is typing |
| `user_stop_typing` | `{ username: string }` | User stopped typing |
| `room_users` | `{ users: Array }` | List of users in room |
| `error` | `{ message: string }` | Error occurred |

## 🎓 Learning Path

### Commit 1: Basic Setup
- Project initialization
- Express server setup
- Basic file structure

### Commit 2: Core Socket.IO Integration
- Socket.IO server configuration
- Connection handling
- Basic event listeners

### Commit 3: Room Management
- Room join/leave functionality
- Room-based broadcasting
- User tracking per room

### Commit 4: Message System
- Message handling
- Message history
- Timestamp management

### Commit 5: Advanced Features
- Typing indicators
- Private messaging
- User presence

### Commit 6: Client Interface
- HTML/CSS UI
- Client-side Socket.IO integration
- User interactions

## 📖 Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Server API](https://socket.io/docs/v4/server-api/)

## 🤝 Contributing

Feel free to fork this project and submit pull requests. This is a learning project, so suggestions and improvements are welcome!

## 📝 License

MIT

## 👤 Author

Your Name - Rezwanur Rakib Chy

---

**Note**: This project is built to practice and understand Socket.IO and real-time communication patterns.