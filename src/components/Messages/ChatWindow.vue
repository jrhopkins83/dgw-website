<template>
  <div class="message-container">
    <q-card class="chat-list-card" flat bordered>
      <q-scroll-area
        ref="first"
        :delay="350"
        @scroll="onScrollFirst"
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
        <q-form
          @submit="sendMessage"
          class="q-gutter-md"
        >
          <q-input
            v-model="message.text"
            label="Message"
            bottom-slots
            class="message-text"
          >
            <template v-slot:append>
              <q-icon
                v-if="message.text !== ''"
                @click="message.text = ''"
                class="cursor-pointer"
                name="close"
              />
            </template>

            <template v-slot:after>
              <q-btn
                :disable="emptyText"
                type="submit"
                color="grey-9"
                label="Send"
                no-caps
                @click="sendMessage"
              />
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
    scroll (source, position) {
      this.$refs[source].setScrollPosition(position)
    },
    onScrollFirst ({ verticalPosition }) {
      this.position = verticalPosition + 200
      this.scroll('first', verticalPosition + 150)
      console.log(this.position)
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
      } catch (error) {
        showMessage('Error', `Error saving new message to Firebase Database: ${error.message}`)
      }
    }
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
