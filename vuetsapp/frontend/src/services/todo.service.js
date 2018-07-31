import axios from 'axios'
import bus from './bus.service'

var todos = [];
window.todos = todos;

const todoUrl = 'http://localhost:3003/data/todo'
const errMsg = errMsg;

const emptyTodo = () => ({
  _id: null,
  txt: '',
  completed: false,
  importance: 2
})

const addTodo = todo => {
  return axios.post(todoUrl, todo)
    .then(function (res) {
      const addedTodo = res.data;
      todos.push(addedTodo)
      bus.$emit('progress');
      return addedTodo;
    })
}

const query = () => {
  if (todos.length) return Promise.resolve(todos);

  return axios.get(todoUrl)
    .then(function (res) {
        todos = res.data;
        bus.$emit('progress');
        return todos;
    })
    .catch(function (err) {
      console.error(errMsg, 'QUERY TODO', err);
    });
}

const updateTodo = todo => {
  return axios.put(`${todoUrl}/${todo._id}`, todo)
    .then(function (res) {
      const updatedTodo = res.data;
      const idx = todos.findIndex(currTodo => currTodo._id === todo._id)
      todos.splice(idx, 1, updatedTodo)
      bus.$emit('progress');
      return updatedTodo;
    })
    .catch(function (err) {
      console.error(errMsg, 'UPDATE TODO', err);
    });
}

const deleteTodo = todoId => {
  return axios.delete(`${todoUrl}/${todoId}`)
    .then(function (res) {
      const idx = todos.findIndex(currTodo => currTodo._id === todoId)
      todos.splice(idx, 1)
      bus.$emit('progress');
    })
    .catch(function (err) {
      console.error(errMsg, 'DELETE TODO', err);
    });
}

const getProgress = () => {
  const count = todos.filter(todo => todo.completed).length
  return (count / todos.length)*100 || 0
}


export default {
  emptyTodo,
  addTodo,
  deleteTodo,
  updateTodo,
  query,
  getProgress
}
