import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateTasks', (tasks) => this.updateTasks(tasks));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('addTask', ({id, name}) => this.addTask(id, name));
  };

  removeTask = (id, localRemoval = false) => {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id),
    });
    if(localRemoval) this.socket.emit('removeTask', id);
  };

  updateTasks = newTasks => {
    this.setState({
      tasks: newTasks,
    });
  };

  addTask = (id, name) => {
    const newTask = {
      id,
      name,
    };
    this.setState({
      tasks: [...this.state.tasks, newTask],
    });
  };

  submitForm = event => {
    event.preventDefault();
    const id = uuidv4();
    this.addTask(id, this.state.taskName);
    this.socket.emit('addTask', {id: id, name: this.state.taskName});
    this.setState({
      taskName: '',
    });
  };

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">

        <header>
          <h1>ToDo List</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task" >{task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id, task.name)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={event => this.submitForm(event)}>
            <input
              className="text-input"
              onChange={event => this.setState({taskName: event.currentTarget.value})}
              autoComplete="off"
              value={taskName}
              type="text"
              placeholder="Type your description"
              id="task-name"
            />
            <button
              className="btn"
              type="submit"
            >
              Add
            </button>
          </form>

        </section>
      </div>
    );
  }
};

export default App;