<template>
  <div class="editor full-width column wrap justify-center items-center content-center">
    <div
      class="canvas"
      @dblclick="dblclick"
    >
      <img
        ref="image"
        :src="data.url"
        :alt="data.name"
        @loadstart="start"
        @load="start"
      >
    </div>
    <q-btn-group class="toolbar">
      <q-btn
        flat
        color="white"
        icon="open_with"
        data-action="move"
        @click="click('move')"
      >
        <q-tooltip content-class="bg-info">
          Drag mouse to move or use arrow keys
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        color="white"
        data-action="crop"
        icon="crop"
        @click="click('crop')"
      >
        <q-tooltip content-class="bg-info">
          Crop to circle
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        color="white"
        data-action="zoom-in"
        icon="zoom_in"
        @click="click('zoom-in')"
      >
        <q-tooltip content-class="bg-info">
          Zoom In
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        color="white"
        data-action="zoom-out"
        icon="zoom_out"
        @click="click('zoom-out')"
      >
        <q-tooltip content-class="bg-info">
          Zoom Out
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        color="white"
        data-action="rotate-left"
        icon="rotate_left"
        @click="click('rotate-left')"
      >
        <q-tooltip content-class="bg-info">
          Rotate Left
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        color="white"
        data-action="rotate-right"
        icon="rotate_right"
        @click="click('rotate-right')"
      >
        <q-tooltip content-class="bg-info">
          Rotate Right
        </q-tooltip>
      </q-btn>
    </q-btn-group>

  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { compressImage } from 'src/functions/functions-common'
import { firebaseStore, storage } from 'boot/firebase'
import { mapActions } from 'vuex'

export default {
  name: 'Editor',

  props: {
    player: {
      type: Object
    },
    imageType: {
      type: String
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      canvasData: null,
      cropBoxData: null,
      croppedData: null,
      cropper: null,
      uploadProgress: 0
    }
  },

  computed: {
    user_avatar: function () {
      if (this.player.avatar) {
        return this.player.avatar
      } else {
        return this.data.url
      }
    }
  },

  mounted () {
    window.addEventListener('keydown', (this.onKeydown = this.keydown.bind(this)))
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeydown)
    this.stop()
  },

  methods: {
    ...mapActions('leagueSettings', ['setUserInfo']),
    click (action) {
      const { cropper } = this

      switch (action) {
        case 'move':
        case 'crop':
          cropper.setDragMode(action)
          break

        case 'zoom-in':
          cropper.zoom(0.1)
          break

        case 'zoom-out':
          cropper.zoom(-0.1)
          break

        case 'rotate-left':
          cropper.rotate(-90)
          break

        case 'rotate-right':
          cropper.rotate(90)
          break

        case 'flip-horizontal':
          cropper.scaleX(-cropper.getData().scaleX || -1)
          break

        case 'flip-vertical':
          cropper.scaleY(-cropper.getData().scaleY || -1)
          break

        default:
      }
    },

    keydown (e) {
      switch (e.key) {
        // Undo crop
        case 'z':
          if (e.ctrlKey) {
            e.preventDefault()
            this.restore()
          }

          break

          // Delete the image
        case 'Delete':
          this.reset()
          break

        default:
      }

      const { cropper } = this

      if (!cropper) {
        return
      }

      switch (e.key) {
        // Crop the image
        case 'Enter':
          this.crop()
          break

          // Clear crop area
        case 'Escape':
          this.clear()
          break

          // Move to the left
        case 'ArrowLeft':
          e.preventDefault()
          cropper.move(-1, 0)
          break

          // Move to the top
        case 'ArrowUp':
          e.preventDefault()
          cropper.move(0, -1)
          break

          // Move to the right
        case 'ArrowRight':
          e.preventDefault()
          cropper.move(1, 0)
          break

          // Move to the bottom
        case 'ArrowDown':
          e.preventDefault()
          cropper.move(0, 1)
          break

          // Enter crop mode
        case 'c':
          cropper.setDragMode('crop')
          break

          // Enter move mode
        case 'm':
          cropper.setDragMode('move')
          break

          // Zoom in
        case 'i':
          cropper.zoom(0.1)
          break

          // Zoom out
        case 'o':
          cropper.zoom(-0.1)
          break

          // Rotate left
        case 'l':
          cropper.rotate(-90)
          break

          // Rotate right
        case 'r':
          cropper.rotate(90)
          break

          // Flip horizontal
        case 'h':
          cropper.scaleX(-cropper.getData().scaleX || -1)
          break

          // Flip vertical
        case 'v':
          cropper.scaleY(-cropper.getData().scaleY || -1)
          break

        default:
      }
    },

    dblclick (e) {
      if (e.target.className.indexOf('cropper-face') >= 0) {
        e.preventDefault()
        e.stopPropagation()
        this.crop()
      }
    },

    start () {
      const { data } = this

      if (data.cropped || this.cropper) {
        return
      }

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: true,
        aspectRatio: 1,
        viewMode: 3,
        minContainerHeight: 300,
        dragMode: 'move',
        background: false,

        ready: () => {
          if (this.croppedData) {
            this.cropper
              .crop()
              .setData(this.croppedData)
              .setCanvasData(this.canvasData)
              .setCropBoxData(this.cropBoxData)

            this.croppedData = null
            this.canvasData = null
            this.cropBoxData = null
          }
        },

        crop: ({ detail }) => {
          if (detail.width > 0 && detail.height > 0 && !data.cropping) {
            this.update({
              cropping: true
            })
          }
        }
      })
    },

    stop () {
      if (this.cropper) {
        this.cropper.destroy()
        this.cropper = null
        // this.$emit('close')
      }
    },

    getRoundedCanvas (sourceCanvas) {
      var canvas = document.createElement('canvas')
      var context = canvas.getContext('2d')
      var width = sourceCanvas.width
      var height = sourceCanvas.height

      canvas.width = width
      canvas.height = height
      context.imageSmoothingEnabled = true
      context.drawImage(sourceCanvas, 0, 0, width, height)
      context.globalCompositeOperation = 'destination-in'
      context.beginPath()
      context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
      context.fill()
      return canvas
    },

    crop () {
      const { cropper, data } = this

      if (data.cropping) {
        this.croppedData = cropper.getData()
        this.canvasData = cropper.getCanvasData()
        this.cropBoxData = cropper.getCropBoxData()

        // Crop
        const croppedCanvas = cropper.getCroppedCanvas()

        // Round
        const roundedCanvas = this.getRoundedCanvas(croppedCanvas)

        this.update({
          cropped: true,
          cropping: false,
          previousUrl: data.url,
          croppedUrl: roundedCanvas.toDataURL('image/png'),
          roundedCanvas: roundedCanvas
        })
      }
    },

    async upload () {
      const { data } = this

      if (data.cropped) {
        // Compress and convert to blob
        const uploadFile = await compressImage(data.roundedCanvas)

        const fileName = `${this.player.firstName}_${this.player.lastName}.png`

        const upload = {
          imageType: this.imageType,
          uploadFile: uploadFile,
          name: fileName
        }

        // Upload to Firebase storage
        return await this.uploadToStorage(upload)
      } else {
        return null
      }
    },

    async uploadToStorage (upload) {
      // Create the file metadata
      const metadata = {
        contentType: 'image/png'
      }

      // Upload file and metadata to the folder_open user_avatars storage folder
      const storageRef = storage.ref()
      const storagePath = `user_${upload.imageType}s/${upload.name}`
      const uploadTask = storageRef.child(storagePath).put(upload.uploadFile, metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed', // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.update({
            loading: true
          })

          this.$emit('update:progress', progress)
          switch (snapshot.state) {
            case 'paused': // or 'paused'
              console.log('Upload is paused')
              break
            case 'running': // or 'running'
              console.log('Upload is running')
              break
          }
        }, (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break

            case 'storage/canceled':
              // User canceled the upload
              break

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
        }, () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            if (upload.imageType === 'avatar') {
              this.update({
                loading: false,
                avatar: downloadURL,
                avatarName: upload.name
              })
              if (this.data.avatar) {
                const playerAvatar = {
                  avatar: {
                    avatarUrl: this.data.avatar,
                    avatarName: this.data.avatarName
                  }
                }
                const playerRef = firebaseStore.collection('players').doc(this.player.playerID)
                playerRef.update(playerAvatar)
                  .then(() => {
                    this.setUserInfo(playerAvatar)
                    // return this.$emit('completed')
                  })
              }
            } else {
              this.update({
                loading: false,
                photo: downloadURL,
                photoName: upload.name
              })
              if (this.data.photo) {
                const playerPhoto = {
                  photo: {
                    photoUrl: this.data.photo,
                    photoName: this.data.photoName
                  }
                }
                const playerRef = firebaseStore.collection('players').doc(this.player.playerID)
                playerRef.update(playerPhoto)
                  .then(() => {
                    this.setUserInfo(playerPhoto)
                    // return this.$emit('completed')
                  })
              }
            }
          })
        })
    },

    clear () {
      if (this.data.cropping) {
        this.cropper.clear()
        this.update({
          cropping: false
        })
      }
    },

    restore () {
      if (this.data.cropped) {
        this.update({
          cropped: false,
          previousUrl: '',
          croppedUrl: '',
          url: this.data.previousUrl
        })
      }
    },

    reset () {
      this.stop()
      this.update({
        cropped: false,
        cropping: false,
        loaded: false,
        name: '',
        previousUrl: '',
        croppedUrl: '',
        type: '',
        url: ''
      })
    },

    update (data) {
      Object.assign(this.data, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
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

.toolbar {
  background-color: rgba(0, 0, 0, .2);
  margin-top: 1.6rem;
  margin-bottom: 2rem;
  color: #fff;
  height: 4rem;
  width: 34rem;
  z-index: 2015;
}

.q-btn {
  background-color: transparent;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #0074d9;
    color: #fff;
  }
}

.cropper-container {
  height: 380px;
  overflow: auto;
  background:var(--black, #000);

}
.cropper-view-box, .cropper-face {
    border-radius: 50%;
}

</style>
