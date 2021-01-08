<template>
  <div>
    <div class="news-section" v-if="announcementsLoaded">
      <div class="news-section__content col-12 q-pa-md">
        <div class="news-section__content--title col-10 text-h2 text-bold">News / Announcements</div>
          <news-item
            v-for="announcement in announcements"
            :announcement="announcement"
            :key="announcement.id"
            :id="announcement.id"
            @viewAnnouncementDetails="viewNewsItem"
          >
          </news-item>
      </div>
    </div>
    <q-dialog
      v-model="showViewAnnouncement"
    >
      <view-announcement-details
        :announcement="announcement"
        :id="id"
        @close="showViewAnnouncement=false"
      />
    </q-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    newsItem: require('components/News/announcementShort.vue').default,
    viewAnnouncementDetails: require('src/components/Modals/ModalViewAnnouncement.vue').default

  },
  data () {
    return {
      showViewAnnouncement: false,
      announcement: {},
      id: ''

    }
  },
  computed: {
    ...mapGetters('announcements', ['announcementsLoaded', 'announcements'])

  },
  methods: {
    viewNewsItem (value) {
      this.announcement = value[0]
      this.id = value[1]
      this.showViewAnnouncement = true
    }
  }
}
</script>

<style lang="scss">
  .news-section {
    position: relative;
    min-height: 20rem;
    max-height: 30rem;
    width: 100%;
    color: $off-white;
    background-image: url(poker_club2.png);
    background-size: cover;
    overflow: auto;

    &__content {
      position: relative;
      width: 100%;
      margin: 0 auto;
      max-height: 31rem;
      max-width: 72rem;

      &--title {
        text-align: center;

      }

      &--list {
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

      }
    }
    &::before {
      content: "";
      position: absolute;
      background-size: cover;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color: rgba(0,0,0,0.7);
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .news-section {
    background-image: url(poker_club2_short.jpg);
    &__content {
      max-height: 31rem;
      max-width: 60rem;
      padding: 8px 8px;

      &--title {
        font-size: 20px;
      }

      &--list {
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
    }
  }
}
</style>
