<template>
  <div class="simple-page">
    <q-card class="my-card">
      <q-card-section>
        <Container
            group-name="1"
            :get-child-payload="getChildPayload"
            @drop="onDrop('items', $event)"
        >
          <Draggable
            v-for="item in items"
            :key="item.id"
          >
            <div class="draggable-item">
              {{item.data}}
            </div>
          </Draggable>
        </Container>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag, generateItems } from '../utils/helpers'

export default {
  name: 'Simple',

  components: {Container, Draggable},
  props: ['items'],
  data () {
    return {

    }
  },

  methods: {
    onDrop (collection, dropResult) {
      this[collection] = applyDrag(this[collection], dropResult)
      console.log('onDrop results = ', dropResult)
      console.log('this[collection] = ', this[collection])
    },

    getChildPayload (index) {
      return this.items[index]
    },

    getChildPayload2 (index) {
      return this.items2[index]
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-card {
    width: 45%;
  }
</style>
