<template>
  <div class="hello">
   <img src="../assets/logo.png" alt="Vue.js PWA">

    <h1>Start Chatting Now!</h1>
    <router-link to="/chat">Chat!</router-link>
    <router-link to="/todos">Todos</router-link>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
