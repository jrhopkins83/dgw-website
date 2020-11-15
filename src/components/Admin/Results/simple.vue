<template>
  <q-card class="my-card">
    <q-card-section>
      <ul class="todo-list">
        <li v-for = "(todo, index) in todos"
          :key="index
        ">
          <div v-show = "todo.edit == false">
            <label @dblclick = "todo.edit = true"> {{todo.title}} </label>
          </div>
          <input v-show = "todo.edit == true" v-model = "todo.title"
          v-on:blur= "todo.edit=false; $emit('update')"
          @keyup.enter = "todo.edit=false; $emit('update')">
        </li>
      </ul>
    </q-card-section>
  </q-card>
</template>

<script>

export default {
  name: 'Simple',

  components: {

  },
  props: ['players'],
  data () {
    return {
      todos: [
        { title: 'one value', edit: false },
        { title: 'one value', edit: false },
        { title: 'otro titulo', edit: false }
      ],
      editedTodo: null,
      message: 'Hello Vue.js!'

    }
  },

  methods: {
    editTodo: function (todo) {
      this.editedTodo = todo
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-card {
    width: 45%;
  }
</style>
