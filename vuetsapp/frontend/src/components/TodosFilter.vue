<template>
  <section>
    <h2>Filter</h2>
    <input type="text" v-model="localFilter.txt" placeholder="Start Typing to filter Todos">
    <ul>
      <li>
        <input type="radio" v-model="localFilter.status" value="all" > All
      </li>
      <li>
        <input type="radio" v-model="localFilter.status" value="completed" > Completed
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {

    return {
      localFilter: {txt: null, status: 'all'}
      // localFilter: Object.assign({}, this.$store.state.filterBy)
    }
  },
  watch: {
    localFilter: {
      handler()  {
        console.log('CHANGED!');
        this.$emit('set-filter',  this.localFilter);
      },
      deep: true
    }
  }
}
</script>

<style scoped>
section {
  background-color: #4fc08d;
  padding: 4px;
}
ul {
  display: inline;
  list-style: none;  
}
li {
  display:inline-block;
}
</style>
