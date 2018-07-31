<template>
  <div>
    <h3>
      Progress:
      <progress max="100" :value="percent" :title="percent"></progress>
    </h3>
  </div>
</template>

<script>
import todoService from '../services/todo.service'
import bus from '../services/bus.service'

export default {
  data(){
    return {
      percent: todoService.getProgress()
    }
  },
  created() {
    bus.$on('progress', ()=>{
      this.percent = todoService.getProgress();
      console.log('Aha', this.percent);
    })
  },
  computed: {
    // percent() {
      // TODO: need to work with a bus / store / observable
      // console.log(todoService.getProgress());
      // return todoService.getProgress();
    // }
  }
}

</script>
