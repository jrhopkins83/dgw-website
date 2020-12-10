<template>
  <div class="col announcement-form">

    <q-card class="add-announcement absolute-center" style="width: 700px; max-width: 80vw;">
      <q-card-section style="min-height: 62rem">
        <modal-header>{{ displayMode }} Announcement</modal-header>
        <q-form
          ref="announcementForm"
        >
          <div class="form-container">
            <div class="attribute-container subject">
              <q-input
                dense
                outlined
                ref="subject"
                fill-input
                v-model="formData.subject"
                label="Subject"
                stack-label
                :rules="[required]"
                style="width: 60rem"
              />
            </div>
            <div class="q-gutter-sm">
              <q-checkbox v-model="formData.heroHeadline" label="Headline on Home Page?" />
            </div>
            <div class="attribute-container text">
              <modal-q-editor
                ref="newsText"
                :qeditor.sync="formData.newsText"
              >
              </modal-q-editor>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <div class="attribute-container card-actions">
          <q-card-actions align="center">
            <q-btn
              label="Submit"
              color="blue-9"
              @click="submitForm"
            />

            <q-btn
              label="Cancel"
              color="primary"
              @click="$emit('close')"
            />
          </q-card-actions>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import formMixin from 'src/mixins/form'
import { selectAll } from 'src/directives/directive-select-all'
import { required } from 'src/utils/validators'
import { toTitleCase } from 'src/functions/functions-common'
import { Timestamp } from 'boot/firebase'

export default {
  mixins: [formMixin],
  components: {
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default,
    modalQEditor: require('components/Modals/Shared/ModalQEditor.vue').default
  },
  props: {
    announcement: {
      type: Object
    },
    mode: {
      type: String
    }
  },
  data () {
    return {
      dense: true,
      formData: {
        subject: '',
        postedDate: '',
        newsText: '',
        heroHeadline: false,
        id: ''
      },
      formHasError: false
    }
  },
  computed: {
    displayMode: function () {
      return toTitleCase(this.mode)
    }
  },
  methods: {
    required,
    async submitForm () {
      this.$refs.subject.validate()
      // this.$refs.newsText.validate()

      // if (this.$v.$invalid) {
      //   this.$nextTick(() => this.focusFirstStatus())
      if (this.$refs.subject.hasError) {
        this.formHasError = true
      }
      if (this.mode === 'add') {
        this.formData.postedDate = Timestamp.fromDate(new Date())
      }

      if (!this.formHasError) {
        this.$emit('save', this.formData)
      } else {
        console.log('formHasError: ', this.formHasError)
      }
    }
  },

  directives: {
    selectAll
  },
  mounted () {
    if (this.announcement.id) {
      this.formData = {
        id: this.announcement.id,
        heroHeadline: this.announcement.heroHeadline,
        subject: this.announcement.subject,
        newsText: this.announcement.newsText,
        postedDate: this.announcement.postedDate
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .announcement-form {
    width: 90%;
    background-color: #C3C3C3;

    .q-card.add-announcement {
      max-width: 75vw;
      width:40vw;
      // height:150px;

      .form-container {
        display: flex;
        justify-content: center;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 5rem 5rem 17rem;

        .attribute-container.structure {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .attribute-container.date {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .attribute-container.buy-in {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .q-field__input {
          font-size: 16px
        }

      }

      .label {
        font-size: 20px;
        margin: 12px 0px 8px 0px;
      }
      .q-input {
        max-width: 90%;
      }
    }
  }
</style>
