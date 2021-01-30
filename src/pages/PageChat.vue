<template>
  <q-page>
  <div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div class="container" v-if="messagesLoaded">
        <div class="left-column">
          <div class="chat-window">
            <messages
              :messages="messages"
              :userInfo="userInfo"
            >
            </messages>
          </div>
        </div>
        <div class="right-column">
          <div class="right-column__image"></div>
        </div>
      </div>
    </transition>
  </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PageChat',
  components: {
    messages: require('components/Messages/ChatWindow.vue').default

  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('messages', ['messages', 'messagesLoaded']),
    ...mapGetters('leagueSettings', ['userInfo']),
    player_avatar: function () {
      if (this.playerNames.avatar.avatarUrl) {
        return this.playerNames.avatar
      } else {
        const image = {
          avatarUrl: 'default.jpg',
          avatarName: 'default.jpg'
        }
        return image
      }
    }
  },
  methods: {
    ...mapActions('messages', ['fbMessages'])
  },
  async mounted () {
    await this.fbMessages()
  }
}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

  .container {
    position: relative;
    height: 100vh;
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    display: grid;
    grid-template-columns: 6.5fr 3.5fr;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent linear-gradient(110deg, #504F4B 0%, #3B3A37 47%, #10100F 100%) 0% 0% no-repeat padding-box;
      background-repeat: no-repeat;
      // background-size: 60% 100%;
    }

    .left-column {
      height: 100vh;
      position: relative;

      .chat-window {
        position: relative;
        height: 95vh;
        width: 100%;
      }
    }

    .right-column {
      &__image {
        position: relative;
        min-height: 45rem;
        width: 100%;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-image: url(poker-dark-background.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;

      }
    }
  }

  @media screen and (max-width: 800px) {
    .container {
      width: 100%;
      grid-template-columns: 1fr;
      align-items: center;
      .right-column {
        display: none;
      }
    }
  }

</style>
