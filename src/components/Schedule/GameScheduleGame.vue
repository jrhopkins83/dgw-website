<template>
  <div>
    <div class="col-2 col-date">
      Date
    </div>
    <div class="col-2 col-buyin">
      Buy-In
    </div>
    <div class="col-2 col-type">
      Type
    </div>
    <div class="col-6 col-structure">
      Structure
    </div>
  </div>
</template>

<script>

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  currency: 'USD'

})

export default {
  name: 'ScheduleGame',
  props: {
    game: Object
  },
  data () {
    return {

    }
  },
  computed: {
    buyin_formatted () {
      return formatter.format(this.game.buyin)
    }
  },
  methods: {
  },
  mounted () {

  }
}

</script>

<style lang="scss" scoped>

</style>
