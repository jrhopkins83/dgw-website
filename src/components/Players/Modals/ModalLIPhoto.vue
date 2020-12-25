<template>
  <div>
    <div
      data-test-modal=""
      role="dialog"
      tabindex="-1"
      class="artdeco-modal artdeco-modal--layer-default"
      size="large"
      aria-labelledby="edit-profile-photo-modal"
    >
      <span class="a11y-text">Dialog content start.</span>
      <button
        data-test-modal-close-btn=""
        aria-label="Dismiss"
        id="ember937"
        class="artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
      >
        <li-icon
          aria-hidden="true"
          type="cancel-icon"
          class="artdeco-button__icon"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            data-supported-dps="24x24"
            fill="currentColor"
            class="mercado-match"
            width="24"
            height="24"
            focusable="false"
          >
            <path
              d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"
            ></path></svg
        ></li-icon>

        <span class="artdeco-button__text"> </span>
      </button>
      <div id="ember938" class="artdeco-modal__header ember-view">
        <h2 id="edit-profile-photo-modal">Edit photo</h2>
      </div>
      <div
        id="ember939"
        class="artdeco-modal__content artdeco-modal__content--no-padding ember-view"
      >
        <div
          id="ember940"
          class="profile-photo-cropper carousel-item-content picture-cropper ember-view"
        >
          <div class="body profile-photo-cropper__body">
            <div class="profile-photo-cropper__cropper mt0">
              <div class="profile-photo-cropper__upload-and-crop">
                <div
                  class="pic-cropper__container pic-cropper__container--crop"
                >
                  <p
                    class="profile-photo-cropper__filter-info t-14 t-white t-normal"
                  >
                    Drag to reposition photo
                  </p>
                  <div
                    class="pic-cropper__target-image-container photo-cropper__circle-frame pic-cropper__image-loaded"
                    tabindex="0"
                    style="width: 230px; height: 230px"
                  >
                    <div class="photo-cropper__thirds">
                      <div
                        class="photo-cropper__thirds-line photo-cropper__thirds-line--top-horizontal"
                      ></div>
                      <div
                        class="photo-cropper__thirds-line photo-cropper__thirds-line--bottom-horizontal"
                      ></div>
                      <div
                        class="photo-cropper__thirds-line photo-cropper__thirds-line--left-vertical"
                      ></div>
                      <div
                        class="photo-cropper__thirds-line photo-cropper__thirds-line--right-vertical"
                      ></div>
                    </div>
                    <img/>
                    <!----><!---->
                  </div>
                  <!---->
                </div>
                <img
                  class="photo-cropper__original-image hidden"
                  src="https://www.linkedin.com/dms/C4E04AQFGP51XCfko_A/profile-originalphoto-shrink_450_600/0/1589399227742?m=AQJdUHnGYob7IwAAAXZzsM9FtdW2O7me84G2nW-huMbKBDp8VP3sTgk&amp;e=1608345135&amp;v=beta&amp;t=waoaSgpr1v4w3SBRnLc2XMBVVcHrQVTO8iiPk1pq-h0"
                />
              </div>

              <div id="ember946" class="photo-filter ember-view">
                <div class="photo-filter__body">
                  <div
                    class="photo-filter__slider-body photo-filter__slider-body--crop"
                  >
                    <div class="photo-filter__slider-container mr5">
                      <label
                        for="zoom"
                        class="photo-filter__slider-info t-12 t-white t-normal"
                      >
                        <span class="photo-filter__slider-info-description"
                          >Zoom</span
                        >
                        <span class="photo-filter__slider-info-value">1.3</span>
                      </label>
                      <div
                        valuetext="Zoom"
                        value="1.2999999999999996"
                        step="0.1"
                        max="3"
                        min="1"
                        id="zoom"
                        class="photo-filter__slider artdeco-slider ember-view"
                      >
                        <!---->
                        <div class="artdeco-slider__content">
                          <!---->
                          <div class="artdeco-slider__container">
                            <input
                              class="artdeco-slider__range"
                              min="1"
                              max="3"
                              step="0.1"
                              aria-valuetext="Zoom"
                              type="range"
                              value="1.3"
                              style="
                                background-size: 100%, 300% 100%, 200%;
                                background-position: left top, 0px -100%,
                                  calc(85% + 7px) center;
                              "
                            />
                          </div>

                          <!---->
                        </div>

                        <!---->
                      </div>
                    </div>
                    <div class="photo-filter__slider-container mr5">
                      <label
                        for="straighten"
                        class="photo-filter__slider-info t-12 t-white t-normal"
                      >
                        <span class="photo-filter__slider-info-description"
                          >Straighten</span
                        >
                        <span class="photo-filter__slider-info-value">0</span>
                      </label>
                      <div
                        valuetext="Straighten"
                        value="0"
                        step="1"
                        max="45"
                        min="-45"
                        id="straighten"
                        class="photo-filter__slider artdeco-slider ember-view"
                      >
                        <!---->
                        <div class="artdeco-slider__content">
                          <!---->
                          <div class="artdeco-slider__container">
                            <input
                              class="artdeco-slider__range"
                              min="-45"
                              max="45"
                              step="1"
                              aria-valuetext="Straighten"
                              type="range"
                              value="0"
                              style="
                                background-size: 100%, 300% 100%, 200%;
                                background-position: left top, 0px -100%,
                                  calc(50% + 0px) center;
                              "
                            />
                          </div>

                          <!---->
                        </div>

                        <!---->
                      </div>
                    </div>
                    <button
                      class="photo-filter__slider-button"
                      data-control-name="crop_rotate"
                      type="button"
                      data-ember-action=""
                      data-ember-action-949="949"
                    >
                      <span class="a11y-text">Rotate</span>
                      <li-icon aria-hidden="true" type="rotate-right-icon"
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          data-supported-dps="24x24"
                          fill="currentColor"
                          class="mercado-match"
                          width="24"
                          height="24"
                          focusable="false"
                        >
                          <path
                            d="M12 3l-2-3h2.37L15 4l-2.63 4H10l2-3a7 7 0 105.78 3h2.31A9 9 0 1112 3z"
                          ></path></svg
                      ></li-icon>
                    </button>
                  </div>
                </div>

                <footer class="photo-filter__footer relative">
                  <div
                    class="photo-filter__footer-button-container display-flex"
                    role="tablist"
                  >
                    <button
                      role="tab"
                      class="photo-filter__footer-button photo-filter__footer-button--selected"
                      aria-selected=""
                      data-control-name="view_crop"
                      type="button"
                      data-ember-action=""
                      data-ember-action-950="950"
                    >
                      <span class="display-block display-flex flex-column">
                        <li-icon
                          aria-hidden="true"
                          type="crop-icon"
                          class="photo-filter__icon inline"
                          ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            data-supported-dps="24x24"
                            fill="currentColor"
                            class="mercado-match"
                            width="24"
                            height="24"
                            focusable="false"
                          >
                            <path
                              d="M2 6h3v2H2zm17 10v2h3v-2zM8 2H6v16h9v-2H8zm1 6h7v14h2V6H9z"
                            ></path></svg
                        ></li-icon>
                        Crop
                      </span>
                    </button>
                    <button
                      role="tab"
                      class="photo-filter__footer-button"
                      data-control-name="view_filters"
                      type="button"
                      data-ember-action=""
                      data-ember-action-951="951"
                    >
                      <span class="display-block display-flex flex-column">
                        <li-icon
                          aria-hidden="true"
                          type="photo-filter-icon"
                          class="photo-filter__icon inline"
                          ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            data-supported-dps="24x24"
                            fill="currentColor"
                            class="mercado-match"
                            width="24"
                            height="24"
                            focusable="false"
                          >
                            <path
                              d="M6 14.5a8.93 8.93 0 00.17 1.71 7.49 7.49 0 1110-10A9.42 9.42 0 0014.5 6 8.52 8.52 0 006 14.5zm16 0A7.5 7.5 0 1114.5 7a7.5 7.5 0 017.5 7.5zm-2 0a5.5 5.5 0 00-3-4.9 6.73 6.73 0 01-.07 1l-1.48-1.51A5 5 0 0014.5 9H14l2.69 2.69a7.24 7.24 0 01-.41 1l-3.47-3.42a5.2 5.2 0 00-1 .43l3.94 3.93a6.84 6.84 0 01-.62.8L11 10.28a5.79 5.79 0 00-.7.7l4.15 4.16a6.84 6.84 0 01-.8.62l-4-3.94a5.2 5.2 0 00-.43 1l3.46 3.45a7.24 7.24 0 01-1 .41L9 14a4.51 4.51 0 000 .52 5 5 0 00.09 1l1.46 1.47a6.73 6.73 0 01-1 .07A5.5 5.5 0 0020 14.5z"
                            ></path></svg
                        ></li-icon>
                        Filter
                      </span>
                    </button>
                    <button
                      role="tab"
                      class="photo-filter__footer-button"
                      data-control-name="view_controls"
                      type="button"
                      data-ember-action=""
                      data-ember-action-952="952"
                    >
                      <span class="display-block display-flex flex-column">
                        <li-icon
                          aria-hidden="true"
                          type="filter-icon"
                          class="photo-filter__icon inline"
                          ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            data-supported-dps="24x24"
                            fill="currentColor"
                            class="mercado-match"
                            width="24"
                            height="24"
                            focusable="false"
                          >
                            <path
                              d="M18.72 11H22v2h-3.28a2 2 0 01-2.74.7 2 2 0 01-.7-.7H2v-2h13.28a2 2 0 012.72-.7 2 2 0 01.72.7zM7 16a2 2 0 00-1.72 1H2v2h3.28a2 2 0 002.72.7 2 2 0 00.7-.7H22v-2H8.72A2 2 0 007 16zm6.72-11A2 2 0 0011 4.3a2 2 0 00-.7.7H2v2h8.28a2 2 0 002.72.7 2 2 0 00.7-.7H22V5z"
                            ></path></svg
                        ></li-icon>
                        Adjust
                      </span>
                    </button>

                    <span
                      tabindex="-1"
                      id="ember954"
                      class="photo-filter__footer-button photo-filter__footer-button--visibility artdeco-hoverable-trigger artdeco-hoverable-trigger--content-placed-top ember-view"
                    >
                      <button
                        class="t-14 t-black--light t-normal pt4"
                        aria-expanded="false"
                        aria-controls="artdeco-hoverable-artdeco-gen-48"
                        data-control-name="view_controls"
                        type="button"
                        data-ember-action=""
                        data-ember-action-955="955"
                      >
                        <span class="display-block display-flex flex-column">
                          <li-icon
                            aria-hidden="true"
                            type="eyeball-icon"
                            class="photo-filter__icon inline"
                            ><svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              data-supported-dps="24x24"
                              fill="currentColor"
                              class="mercado-match"
                              width="24"
                              height="24"
                              focusable="false"
                            >
                              <path
                                d="M12 5a11.8 11.8 0 00-11 7 11.74 11.74 0 0011 7 11.76 11.76 0 0011-7 11.76 11.76 0 00-11-7zm0 12a5 5 0 115-5 5 5 0 01-5 5zm3-5a3 3 0 11-3-3 3 3 0 013 3z"
                              ></path></svg
                          ></li-icon>
                          <span> Visibility </span>
                        </span>
                      </button>
                      <div id="artdeco-gen-48" class="ember-view">
                        <div id="ember957" class="ember-view"></div></div
                    ></span>
                    <div
                      class="photo-filter__footer-bar"
                      style="left: 0px; width: 120px"
                    ></div>
                  </div>
                </footer>
              </div>
            </div>
          </div>

          <footer class="profile-photo-cropper__actions">
            <div class="display-flex">
              <button
                data-control-name="delete_profile_photo"
                id="ember941"
                class="artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
                type="button"
              >
                <!---->
                <span class="artdeco-button__text"> Delete photo </span>
              </button>
            </div>
            <div class="display-flex">
              <button
                data-control-name="change_upload_photo"
                id="ember942"
                class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view m0 mr3"
                type="button"
              >
                <!---->
                <span class="artdeco-button__text"> Change photo </span>
              </button>
              <button
                data-control-name="profile_photo_crop_save"
                id="ember943"
                class="profile-photo-cropper__apply-action artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
                type="button"
              >
                <!---->
                <span class="artdeco-button__text"> Save photo </span>
              </button>
            </div>
          </footer>

          <!---->
        </div>
      </div>
      <span class="a11y-text">Dialog content end.</span>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'

export default {
  name: 'Editor',

  props: {
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
      cropper: null
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
    click ({ target }) {
      const { cropper } = this
      const action = target.getAttribute('data-action') || target.parentElement.getAttribute('data-action')

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
        aspectRatio: 16 / 9,
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
      }
    },

    crop () {
      const { cropper, data } = this

      if (data.cropping) {
        this.croppedData = cropper.getData()
        this.canvasData = cropper.getCanvasData()
        this.cropBoxData = cropper.getCropBoxData()
        this.update({
          cropped: true,
          cropping: false,
          previousUrl: data.url,
          url: cropper.getCroppedCanvas(data.type === 'image/png' ? {} : {
            fillColor: '#fff'
          }).toDataURL(data.type)
        })
        this.stop()
      }
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

<style scoped>
.artdeco-modal[size="large"] {
    width: 744px;
}

.artdeco-modal, .modal-wormhole-content {
    background-color: var(--color-background-container)!important;
    border-radius: var(--corner-radius-medium)!important;
}

@media screen and (max-height: 960px) {
    .artdeco-modal {
        top: 32px;
        max-height: calc(100vh - 160px);
    }
}

@media screen and (min-width: 1024px) {
  .artdeco-modal[size=large] {
    max-width: 744px;
  }
}
</style>
