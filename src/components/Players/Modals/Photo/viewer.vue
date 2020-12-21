<template>
  <div class="viewer full-width column wrap ">
    <div class="text-h4 text-white text-bold text-center q-mb-sm">
      Preview
    </div>
    <div
      class="canvas"
    >
      <img
        ref="image"
        :alt="data.name"
        :src="data.croppedUrl"
      >
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'

export default {
  name: 'Viewer',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

.viewer {
  height: 94%;
  display: flex;
  margin-left: 5%;
  margin-top: 5%;
}

.canvas {
  align-items: center;
  display: flex;
  height: 383px;
  max-width: 60rem;
  justify-content: center;
  align-self: center;
  justify-self: center;

  img {
    max-width: 100%;
    max-height: 100%;
    align-self: center;
    justify-self: center;
  }
}
</style>
