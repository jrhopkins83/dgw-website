<template>
  <div class="flex-center column">
    <div class="row background-section">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
  }
}
</script>

<style lang="scss">
  .background-section {
    position: relative;
    height: 33rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(cards_in_the_air.png);
    background-size: cover;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color: rgba(0,0,0,0.25);
      // background-color: rgba(152, 66, 211, 0.63);
    }

  }

  .q-page {
    min-height: auto;
  }
</style>
