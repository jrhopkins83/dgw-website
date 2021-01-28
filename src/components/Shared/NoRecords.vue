<template>
  <transition
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut absolute-top"
  >
    <div class="no-players absolute-center text-h4">
      {{ message}}
    </div>
  </transition>
</template>

<script>
export default {
  props: ['message']

}
</script>

<style lang="scss" scoped>

</style>
