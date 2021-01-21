<template>
  <div class="news_item row wrap justify-between items-start content-start">
    <div class="headline--subject">
      <div>
        <div class="text-h3 text-bold">{{ item.subject}}</div>
      </div>
    </div>
    <div class="news--detail">
      <div class="row text-h4 text-bold news-date">
        {{ formattedDate}}
      </div>
      <div
        class="col-12 news-body"
        v-html="item.newsText"
      >
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'Announcement',
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  computed: {
    formattedDate: function () {
      return date.formatDate(this.item.postedDate.toDate(), 'dddd MMMM D, YYYY')
    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.news_item {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 40rem;
  max-height: 50rem;
  margin-bottom: 1.6rem;
  color: black;
  background-color: $off-white;
  border-radius: 8px;
}
.headline--subject {
  font-size: 2rem;
  margin-top: 1rem;
  margin-left: 1.6rem;
  margin-bottom: 1rem;
}

.news--detail {
  margin-left: 1.6rem;
  margin-right: 1.6rem;
  min-height: 22rem;
  max-height: 43rem;
}
.news-date {
  margin-bottom: 0.8rem;
  overflow: hidden;
}

.news-body {
  position: relative;
  overflow: auto;
  margin: 0.4rem;
  min-height: 4rem;
  max-height: 40rem;
  line-height: 2.5rem;
  font-weight: 400;
  overflow: auto;
}

@media screen and (max-width: 600px) {
  .news_item {
    margin: 4px;

    .headline--subject {
      font-size: 1.6rem;
    }

    .news--detail {
      .news-date {
        font-size: 1.6rem;
      }
    }
  }
}

@media screen and (max-width: 375px) {
  .news_item {
    max-height: 40rem   ;

  }
}
</style>
