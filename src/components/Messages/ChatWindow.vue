<template>
  <div class="message-container">
    <q-card class="chat-list-card" flat bordered>
      <q-scroll-area
        ref="chatScroll"
      >
        <div class="show-message-button text-center no-pointer-events" v-if="showNewMessageButton">
          <q-btn
            @click="scrollToBottom"
            class="all-pointer-events"
            color="blue"
            no-caps
            label="New Messages"
          />
        </div>
        <template v-if="!Object.keys(messages).length">
          <div class="no-message">
            <no-messages
              :message="noMessages"
            >
            </no-messages >
          </div>
        </template>
        <template v-else>
          <chat
            v-for='(message, id) in messages'
            :key='id'
            :message='message'
            :uid='userInfo.uid'
          >
          </chat>
        </template>
      </q-scroll-area>

      <q-separator />

      <q-card-section horizontal>
        <q-form @submit.prevent="sendMessage">
          <q-input
            class="message-text"
            v-model="message.text"
            label="Message"
            bottom-slots
            clearable
            clear-icon="close"
            maxlength="300"
          >
            <template v-slot:after>
              <q-btn
                :disable="emptyText"
                :loading="submitting"
                type="submit"
                color="grey-9"
                label="Send"
                no-caps
                @click="sendMessage"
              >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </template>
          </q-input>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { firebaseStore, Timestamp } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'

export default {
  name: 'ChatWindow',
  components: {
    chat: require('components/Messages/Chat.vue').default,
    noMessages: require('components/Shared/NoRecords.vue').default
  },
  props: ['messages', 'userInfo'],
  data () {
    return {
      noMessages: 'No messages have been posted yet',
      submitting: false,
      message: {
        text: '',
        uid: this.userInfo.uid,
        playerName: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
        avatarUrl: this.userInfo.avatar.avatarUrl,
        timeStamp: null
      },
      showNewMessageButton: false
    }
  },
  watch: {
    messageCount: function () {
      // Check if scroll position at bottom of the scroll area
      // If not and the show new message button is not already visible, make it visible
      if (this.scrollProperties.scrollPosition !== this.scrollProperties.scrollHeight - this.scrollProperties.offsetHeight &&
        !this.showNewMessageButton) {
        this.showNewMessageButton = true
      } else {
        this.scroll()
      }
    }
  },
  computed: {
    emptyText: function () {
      if (this.message.text.length) {
        return false
      } else {
        return true
      }
    },
    scrollProperties () {
      const scrollArea = this.$refs.chatScroll
      const scrollTarget = scrollArea.getScrollTarget()
      return {
        scrollHeight: scrollTarget.scrollHeight,
        offsetHeight: scrollTarget.offsetHeight,
        scrollPosition: scrollArea.getScrollPosition()
      }
    },
    messageCount () {
      return this.messages.length
    }
  },
  methods: {
    ...mapActions('messages', ['addMessage']),
    scroll () {
      const scrollArea = this.$refs.chatScroll
      const duration = 350
      scrollArea.setScrollPosition(this.scrollProperties.scrollHeight, duration)
    },
    scrollToBottom () {
      this.scroll()
      this.showNewMessageButton = false
    },
    async sendMessage () {
      try {
        const messagesRef = firebaseStore.collection('messages')
        const newMessage = {
          uid: this.message.uid,
          playerName: this.message.playerName,
          text: this.message.text,
          avatarUrl: this.message.avatarUrl,
          timestamp: Timestamp.fromDate(new Date())
        }
        await messagesRef.add(newMessage)
        this.message.text = ''
        this.scroll()
      } catch (error) {
        showMessage('Error', `Error saving new message to Firebase Database: ${error.message}`)
      }
    }
  },
  mounted () {
    this.scroll()
  }
}
</script>

<style lang="scss" scoped>
  .message-container {
    height: 96%;
    width: 98%;
    display: flex;
    justify-content: center;
    align-content: center;

    .chat-list-card {
      position: relative;
      height: 96%;
      width: 100%;
      top: 1.6rem;
      left: 1.6rem;

      .show-message-button {
        font-weight: bold;
      }
      .no-message {
        margin-top: 10rem;
      }

      .q-scrollarea {
        margin: 1.6rem;
        height: 72vh;
      }

      .q-form {
        margin-left: 1.6rem;
        margin-top: 1.6rem;
        width: 90%;
      }
    }
  }
  @media screen and (max-width: 800px) {
    .message-container {
      width: 90%;
      align-self: center;
    }
  }
  @media screen and (max-height: 612px) {
    .message-container {
      height: 94%;
      .chat-list-card {
        .q-scrollarea {
          height: 68vh;
        }
      }
    }
  }

</style>
