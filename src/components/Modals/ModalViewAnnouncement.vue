<template>
  <div class="col announcement-form">

    <q-card class="announcement absolute-center" style="width: 700px; max-width: 80vw;">
      <q-card-section style="height: 57rem">
        <modal-header>News / Announcement Details</modal-header>
        <div class="form-container">
          <div class="attribute-container date">
            <div class="attribute date text-h4 text-bold">{{ posted_date }}</div>
          </div>
          <div class="attribute-container subject">
            <div class="label text-bold">
              Subject / Headline
            </div>
            <div class="attribute location field">{{ announcement.subject }}</div>
          </div>
          <div class="attribute-container notes">
            <div v-html="announcement.newsText"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="attribute-container card-actions">
          <q-card-actions align="center">
            <q-btn
              label="Close"
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
import { date } from 'quasar'

export default {
  name: 'ModalViewAnnouncement',
  components: {
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default
  },
  props: {
    announcement: {
      type: Object
    },
    id: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {
    posted_date: function () {
      // replace after getting data form FS
      const newsDateTm = this.announcement.postedDate.toDate()
      const shortDate = date.formatDate(newsDateTm, 'dddd MMMM Do, YYYY')
      return shortDate
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .announcement-form {
    width: 90%;
    background-color: #C3C3C3;

    .q-card.announcement {
      max-width: 75vw;
      width:40vw;
      // height:150px;

      .form-container {
        display: flex;
        justify-content: center;
        padding: 1.6rem;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 3rem 12rem 4fr;

        .attribute-container {
          margin-bottom: 1.6rem;

          .field {
            background-color: #e5e2e2;
            padding: 8px;
          }
        }

        .attribute-container.structure {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 1rem;
        }

        .attribute-container.date {
          display: grid;
          grid-template-columns: 1fr;
        }

        .attribute.location {
          min-height: 5rem;
        }

        .attribute-container.buy-in {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 1rem;
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
