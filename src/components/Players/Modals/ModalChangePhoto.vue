<template>
  <div class="col-12 photo-form">
    <q-card tag="div" class="change-photo">
      <q-card-section>
        <modal-header>Edit Photo</modal-header>
      </q-card-section>
      <q-card-section tag="div" class="photo-section q-pa-none">
        <header class="header">
          <span class="title" v-if="data.loaded || data.avatarUrl">
            Use the icons below to move around, zoom-in or out or adjust the image. Click checkmark to the right to preview.
          </span>
          <navbar
            :data="data"
            @change="change"
          />
        </header>
        <div class="photo-grid">
          <div class="photo-canvas">
            <editor
              v-if="data.loaded || data.avatarUrl"
              ref="editor"
              :progress.sync="progress"
              :data="data"
              :player="player"
              :imageType="imageType"
              @save="$emit('save', data.avatarUrl)"
              @close="$emit('close')"
            />
            <loader
              v-else
              ref="loader"
              :data="data"
            />
          </div>
            <viewer
              v-if="data.croppedUrl"
              ref="viewer"
              :data="data"
            />
        </div>

      </q-card-section>

      <q-card-section class="q-pa-none" v-if="data.loading">
        <q-linear-progress size="25px" :value="progress" color="info">
          <div class="flex flex-center">
            <q-badge color="white" text-color="info" :label="progressLabel" />
          </div>
        </q-linear-progress>
      </q-card-section>

      <q-card-section class="actions q-pa-none">
        <q-card-actions align="evenly">
          <q-btn
            label="Change Photo"
            color="grey-9"
            style="width:14rem;"
            @click="change('remove')"
          />

          <q-btn
            v-if="data.cropped"
            label="Save"
            color="blue-9"
            style="width:10rem;"
            @click="savePhoto"
          />

          <q-btn
            label="Cancel"
            color="primary"
            style="width:10rem;"
            @click="$emit('close')"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

export default {
  name: 'ModalChangePhoto',
  components: {
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default,
    navbar: require('components/Players/Modals/Photo/navbar.vue').default,
    loader: require('components/Players/Modals/Photo/loader.vue').default,
    viewer: require('components/Players/Modals/Photo/viewer.vue').default,
    editor: require('components/Players/Modals/Photo/editor.vue').default
  },
  props: {
    player: {
      type: Object
    },
    imageUrl: {
      type: String
    },
    itemId: {
      type: String
    },
    imageType: {
      type: String
    }
  },
  data () {
    return {
      data: {
        cropped: false,
        cropping: false,
        loaded: false,
        loading: false,
        name: '',
        previousUrl: '',
        croppedUrl: '',
        roundedCanvas: '',
        type: '',
        imageName: this.imageName,
        imageUrl: this.imageUrl
      },
      progress: 0
    }
  },
  computed: {
    progressLabel () {
      return `loading: ${this.progress.toFixed(2)} %`
    }
  },
  methods: {
    async change (action) {
      // const { cropper } = this
      const { editor } = this.$refs

      switch (action) {
        case 'crop':
          editor.crop()
          break

        case 'clear':
          editor.clear()
          break

        case 'restore':
          editor.restore()
          break

        case 'remove':
          editor.reset()
          break

        case 'upload':
          await editor.upload()
          break

        default:
      }
    },
    setImage () {
      this.$emit('close')
    },
    async savePhoto () {
      await this.change('upload')
      this.change('stop')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .photo-form {
    width: 100%;
    max-width: 91vw;

    .change-photo {
      width: 100%;
      max-width: 91vw;
      height: 70rem;
      transition: box-shadow 83ms;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      margin: 0 auto;

      .photo-section {
        background-color: #333;
        height: 529px;
        width: 100%;

        .header {
          background-color: #666;
          height: 3rem;
          overflow: hidden;
          padding-left: 1rem;
          padding-right: 1rem;
          position: relative;
          z-index: 1;

          .title {
              color: #fff;
              display: block;
              float: left;
              line-height: 3rem;
          }
        }

        .photo-grid {
          height: 100%;
          display: grid;
          grid-template-columns: 3fr 2fr;

          .photo-canvas {
            width: 90%;
            height: 100%;
          }

          .crop-preview {
            width: 90%;
            height: 100%;

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

          }
        }

      }
    }

    .actions {
      margin-top: 2rem;
    }
  }

@media (min-width: 768px) {
  .header {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

</style>
