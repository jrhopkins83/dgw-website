<template>
  <q-input
    v-model="searchField"
    @keyup.esc="searchField = ''"
    v-select-all
    outlined
    dense
    class="col"
    label="Search"
    size="4rem"
  >

    <template v-slot:append>
      <q-icon
        v-if="searchField !== ''"
        @click="searchField = ''"
        class="cursor-pointer"
        name="close"
        size="2rem"
      />
      <q-icon
        name="search"
        size="3rem"
      />
    </template>

  </q-input>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { selectAll } from 'src/directives/directive-select-all'

export default {
  props: [],
  computed: {
    ...mapGetters('standings', ['search']),
    searchField: {
      get () {
        return this.search
      },
      set (value) {
        this.setSearch(value)
      }
    }
  },
  methods: {
    ...mapActions('standings', ['setSearch'])
  },
  directives: {
    selectAll
  }
}
</script>
