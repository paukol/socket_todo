const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

let tasks = [];

const app = express();
app.use(cors());

app.use('*',(req, res) => {
  res.send('Not found...');
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
  
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New socket', socket.id);
  socket.emit('updateData', tasks);
  socket.on('removeTask', (id) => {
    tasks = tasks.filter(task => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });
  socket.on('addTask', task => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('updateTask', newTask => {
    console.log(`${socket.id} updates task ${newTask.id}`);
    const task = tasks.find(task => task.id === newTask.id);
    task.name =newTask.name;
    socket.broadcast.emit('updateTask', newTask);
  });
});