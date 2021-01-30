<template>
  <div class="message-container">
    <q-card class="chat-list-card" flat bordered>
      <q-scroll-area
        ref="chatScroll"
      >
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
    }
  },
  methods: {
    ...mapActions('messages', ['addMessage']),
    scroll () {
      const scrollArea = this.$refs.chatScroll
      const scrollTarget = scrollArea.getScrollTarget()
      const duration = 350
      scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration)
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
      height: 96%;
      width: 100%;
      top: 1.6rem;
      left: 1.6rem;

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
