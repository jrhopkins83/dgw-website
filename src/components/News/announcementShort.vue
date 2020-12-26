<template>
  <div class="news_item">
    <div class="news_item-headline row wrap justify-between items-start content-start">
      <div class="headline--subject">
        <div>
          <div>{{ announcement.subject}}</div>
        </div>
      </div>
      <div class="headline-button">
        <div>
          <q-btn
            color="white"
            label="Read more..."
            flat
            @click="$emit('viewAnnouncementDetails', [announcement, id])"
          />
        </div>
      </div>
    </div>
    <div class="news--detail">
      <div class="row text-h4 news-date">
        {{ dateFormated }}
      </div>
      <div class="col-12 text-body1 news-body">
        {{ strippedAnnouncement }}
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
import { stripHTML } from 'src/functions/functions-common'

export default {
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
    dateFormated: function () {
      const startDateTm = this.announcement.postedDate.toDate()
      return date.formatDate(startDateTm, 'dddd MM/DD/YYYY')
    },
    strippedAnnouncement: function () {
      return stripHTML(this.announcement.newsText)
    }
  },
  methods: {
    viewNewsItem () {
      console.log('News item clicked')
      const originalString = `
      <div>
        <p>Hey that's <span>somthing</span></p>
      </div>
    `

      const strippedString = originalString.replace(/(<([^>]+)>)/gi, '')

      console.log(strippedString)
    }
  }
}
</script>

<style lang="scss" scoped>
  .news_item {
    position: relative;
    overflow: hidden;
    height: 12rem;
    margin: 1.6rem;
    // padding: .8rem;

    .news_item-headline {
      margin: .8rem;

      .headline--subject {
        font-size: 2rem;
      }

      .headline-button {
        color: $off-white;

        .q-btn {
          text-transform: none;
        }
      }

    }

    .news--detail {
      margin-left: .8rem;
      .news-date {
        margin-bottom: .8rem;
        overflow: auto;
      }

      .news-body {
        position: relative;
        overflow: auto;
        margin: .4rem;
        height: 2.5rem;
        line-height: 2.5rem;
        font-weight: 400;
        overflow:hidden;
      }
    }

    &::before {
      content: "";
      position: absolute;
      background-size: cover;
      border-radius: 1.8rem;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color: rgba(234, 234, 234, 0.4)
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .news_item {
    margin: 4px;
    .news_item-headline {
      margin: .8rem;

      .headline--subject {
        font-size: 1.6rem;
      }

    }
    .news--detail {
      .news-date {
        font-size: 1.6rem;
      }
    }
  }
}
</style>
