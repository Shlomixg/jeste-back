<template>
  <section>
    <h1>Todos</h1>
    <todos-filter @set-filter="setFilter"></todos-filter>
    <ul>
      <li v-for="(todo, idx) in todosToShow" :key="todo._id">
        {{idx}}.
        <input type="checkbox" :checked="todo.completed" @change="toggleTodo(todo)"> {{todo.txt}}
        <button :disabled="!todo.completed" @click="deleteTodo(todo._id)">x</button>
        </h6>
      </li>
      <form @submit.prevent="addTodo">
        <input type="text" v-model="newTodo.txt">
        <button>Add</button>
      </form>
  
    </ul>
  
  </section>
</template>

<script>


import todoService from '../services/todo.service'
import TodosFilter from './TodosFilter'

export default {
  data() {
    return {
      newTodo: todoService.emptyTodo(),
      todos: [],
      todosFilter: null
    }
  },
  created() {
    todoService.query()
      .then(todos => this.todos = todos)
    // this.$store.dispatch({ type: TODO_LOAD });
  },
  computed: {
    todosToShow() {
      if (!this.todosFilter)  return this.todos;
      var filteredTodos = this.todos;
      if (this.todosFilter.status === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed)
      }
      if (this.todosFilter.txt) {
        filteredTodos = filteredTodos.filter(todo => todo.txt.includes(this.todosFilter.txt))
      }
      return filteredTodos;

    }
    // todos() {
    // return todoService.query()
    // return this.$store.getters.filteredTodos
    // }
  },
  methods: {
    toggleTodo(todo) {
      const todoUpdated = Object.assign({},
        todo,
        { completed: !todo.completed }
      )
      todoService.updateTodo(todoUpdated)
        .then(_ => console.log('Updated!'))
      // this.$store.dispatch({ type: TODO_UPDATE, todo: todoUpdated });
    },
    addTodo() {
      todoService.addTodo(this.newTodo)
      this.newTodo = todoService.emptyTodo();
    },
    deleteTodo(todoId) {
      todoService.deleteTodo(todoId)
        .then(_ => console.log('Deleted!'))

    },
    setFilter(filter) {
      this.todosFilter = filter;
      console.log(this.todosFilter);
    }

  },
  components: {
    TodosFilter
  }
}
</script>


<style scoped>
section {
  text-align: initial;
  padding: 0 10px;
}

li {
  list-style: none;
  display: block;
  padding: 10px;
  border-bottom: 1px solid lightgray;
}

button[disabled] {
  background-color: white;
  cursor: not-allowed;
}
</style>
