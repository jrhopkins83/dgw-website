<template>
  <transition
    appear
    enter-active-class="animated fadeInLeft"
    leave-active-class="animated fadeOutRight"
  >
    <div>
      <div class="grid-container">
        <div class="left-image"></div>
        <div class="headline text-h3 text-bold">
          Donkey's Gone Wild News & Announcements
        </div>
        <div class="right-image"></div>
        <div class="left-background-image">

        </div>
        <div class="news-item gt-xs">
          <q-carousel
            v-model="slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="white"
            navigation
            padding
            arrows
            prev-icon="arrow_left"
            next-icon="arrow_right"
            height="60rem"
            class="bg-black shadow-1 rounded-borders"
          >
            <q-carousel-slide
              v-for="(announcement, index) in announcements"
              :key="announcement.id"
              :name="index"
            >
              <news-item
                :item="announcement"
              >
              </news-item>
            </q-carousel-slide>
          </q-carousel>
        </div>
        <div class="news-item xs">
          <q-carousel
            v-model="slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="white"
            navigation
            padding
            class="bg-black shadow-1 rounded-borders"
          >
            <q-carousel-slide
              v-for="(announcement, index) in announcements"
              :key="announcement.id"
              :name="index"
            >
              <news-item
                :item="announcement"
              >
              </news-item>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </div>
    </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PageAnnouncements',
  components: {
    newsItem: require('src/components/News/ViewAnnouncement.vue').default
  },
  data () {
    return {
      slide: 0
    }
  },
  computed: {
    ...mapGetters('announcements', ['announcementsLoaded', 'announcements'])
  },
  methods: {
    ...mapActions('announcements', ['fbGetAnnouncements', 'setAnnouncementsLoaded'])
  },
  async mounted () {
    if (!this.announcementsLoaded) {
      await this.fbGetAnnouncements()
    }
  }

}
</script>

<style lang="scss" scoped>
.q-page {
  min-height: auto;
}

html, body, .grid-container { height: 100%; margin: 0; }

.grid-container * {
  position: relative;
}

.material-icons {
    font-size: 54px;
}

.grid-container {
  // min-height: 93vh;
  width: 100%;
  color: white;
  display: grid;
  background: #060607 0% 0% no-repeat padding-box;
  grid-template-columns: 1fr 1fr 1fr 2fr 1fr;
  grid-template-rows: repeat(6, 1fr);
  gap: 0px 0px;
  grid-template-areas:
    "left-image headline headline headline right-image"
    "left-background-image left-background-image news-item news-item right-image"
    "left-background-image left-background-image news-item news-item right-image"
    "left-background-image left-background-image news-item news-item ."
    ". . news-item news-item ."
    ". . news-item news-item .";

  &::before {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 0px;
    /* UI Properties */
    background: #060607 0% 0% no-repeat padding-box;
    opacity: 1;
  }
}

.left-image {
  grid-area: left-image;
  position: relative;
  min-height: 13rem;
  width: 13rem;
  top: 1rem;
  right: 0px;
  bottom: 0px;
  left: 1rem;
  background-image: url(news-icon-white.png);
  background-repeat: no-repeat;
  background-size: cover;
}

.headline {
  grid-area: headline;
  position: relative;
  justify-self: center;
  align-self: center;
}

.right-image {
  grid-area: right-image;
  position: relative;
  min-height: 13rem;
  width: 21rem;
  // top: 1rem;
  right: 0px;
  bottom: 0px;
  background-image: url(throwing-cards.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

.left-background-image {
  grid-area: left-background-image;
  background-image: url(pocket_aces2-blurred.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

.news-item {
  grid-area: news-item;
}

.news-item.xs {
  .q-carousel {
    height: 54rem;
  }
}

@media screen and (max-width: 1230px) {
  .grid-container {
    grid-template-columns: 1fr 1fr 1fr 2fr;
    grid-template-areas:
      "left-image headline headline headline "
      "left-background-image news-item news-item news-item"
      "left-background-image news-item news-item news-item"
      "left-background-image news-item news-item news-item"
      ". . news-item news-item"
      ". . news-item news-item" !important;
    .right-image {
      display: none;
    }
  }
}

@media screen and (max-width: 788px) {
  .grid-container {
    grid-template-columns: 1fr !important;
    grid-template-rows: 6rem repeat(5, 1fr);
    grid-template-areas:
      "headline"
      "news-item"
      "news-item"
      "news-item"
      "news-item"
      "news-item" !important;

    .headline {
      text-align: center;
    }
    .left-image {
      display: none;
    }
    .right-image {
      display: none;
    }
  }
}

@media screen and (max-width: 414px) {
  .grid-container {
    .headline {
      font-size: 2rem;
      text-align: center;
    }
    .left-image {
      display: none;
    }
  }
}
</style>
