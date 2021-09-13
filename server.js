const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
app.use(cors());

let tasks = [];

app.use((req,res) => {
  return res.status(404).json({
    message: 'Not found...',
  });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! His id is ' + socket.id);
  socket.emit('updateTasks', tasks);
  socket.on('removeTask', (id) => {
    tasks = tasks.filter(task => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });
  socket.on('addTask', ({id, name}) => {
    const newTask = {
      id,
      name,
    };
    tasks = [...tasks, newTask];
    socket.broadcast.emit('addTask', newTask);
  });
});