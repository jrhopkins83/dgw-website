<template>
  <div>
    <div class="content">
      <div fluid class="wrapper">
        <div class="row">
          <div class="col">
            <div class="list">
              <drag v-for="n in [1,2,3,4,5]" :data="n" class="item" :key="n">{{n}}</drag>
            </div>
          </div>
          <div class="col">
            <drop-list
              :items="items"
              class="list"
              @insert="onInsert"
              @reorder="$event.apply(items)"
            >
              <template v-slot:item="{item}">
                <drag class="item" :key="item">{{item}}</drag>
              </template>
              <template v-slot:feedback="{data}">
                <div class="item feedback" :key="data">{{data}}</div>
              </template>
            </drop-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Drag, DropList } from 'vue-easy-dnd'

export default {
  name: 'TestDrag',
  components: {
    Drag,
    DropList
  },
  data: function () {
    return {
      items: ['a', 'b', 'c', 'd', 'e']
    }
  },
  methods: {
    onInsert (event) {
      this.items.splice(event.index, 0, event.data)
    }
  }
}
</script>

<style lang="scss" scoped>
html,
body,
#app,
.v-application--wrap,
.v-content,
.v-content__wrap {
  height: 100%;
}

.drop-in {
  box-shadow: 0 0 10px rgba(0, 0, 255, 0.3);
}
</style>

<style scoped lang="scss">
.wrapper {
  .list {
    border: 1px solid black;
    margin: 100px auto;
    width: 200px;

    .item {
      padding: 20px;
      margin: 10px;
      background-color: rgb(220, 220, 255);
      display: flex;
      align-items: center;
      justify-content: center;

      &.feedback {
        background-color: rgb(255, 220, 220);
        border: 2px dashed black;
      }

      &.drag-image {
        background-color: rgb(220, 255, 220);
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
