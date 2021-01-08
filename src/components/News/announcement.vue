<template>
  <div class="news_item row wrap justify-between items-start content-start">
    <div class="headline--subject">
      <div>
        <div class="text-h3 text-bold q-mt-sm">{{ item.subject}}</div>
      </div>
    </div>
    <div class="attribute-container headline-buttons" v-if="adminButtons">
      <div class="attribute edit">
        <q-btn
          icon="edit"
          flat
          size="md"
          @click="$emit('editItem', [item])"
        />
      </div>
      <div class="attribute delete">
        <q-btn
          icon="delete"
          flat
          color="dark-grey"
          size="md"
          @click="$emit('deleteItem', [item])"
        />
      </div>
    </div>
    <div class="news--detail">
      <div class="row text-h4 text-bold news-date">
        {{ formattedDate }}
      </div>
      <div
        class="col-12 news-body"
        v-html="item.newsText"
      >
      </div>
      <!-- <div
        class="col-12 news-body"
      >
        {{ item.newsText}}
      </div> -->
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
    },
    isAdmin: {
      type: Boolean
    }
  },
  data () {
    return {

    }
  },
  computed: {
    adminButtons: function () {
      if (this.isAdmin) {
        return true
      } else {
        return false
      }
    },
    formattedDate: function () {
      return date.formatDate(this.item.postedDate.toDate(), 'dddd MMMM D, YYYY')
    }
  },
  methods: {
    editItem () {

    },
    deleteItem () {

    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
  .attribute-container.headline-buttons {
    display: grid;
    grid-template-columns: repeat(2, 4rem);
    grid-gap: 4px;
    position: relative;
    color: $icon-grey;

    .q-btn {
      text-transform: none;
    }
  }

.news_item {
  position: relative;
  overflow: hidden;
  width: 95%;
  min-height: 5rem;
  max-height: 27rem;
  margin-bottom: 1.6rem;
  margin-left: 1.6rem;
  background-color: $off-white;
  border-radius: 8px;
}
.headline--subject {
  font-size: 2rem;
  margin-left: 1.6rem;
  margin-bottom: 1rem;
}

.news--detail {
  margin-left: 1.6rem;
  margin-right: 1.6rem;
  height: 22rem;
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
  max-height: 18rem;
  line-height: 2.5rem;
  font-weight: 400;
  overflow: auto;
}

@media screen and (max-width: 600px) {
  .news_item {
    margin: 4px;
      margin: .8rem;

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
</style>
