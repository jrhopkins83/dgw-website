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
            <picker
              v-show="showEmojiPicker"
              title="Pick your emoji..."
              emoji="point_up"
              @select="addEmoji"
            />

            <q-input
              ref="textarea"
              class="textarea"
              v-model="message.text"
              label="Message"
              bottom-slots
              clearable
              clear-icon="close"
              maxlength="300"
            >
              <span
                class="emoji-trigger"
                :class="{ 'triggered': showEmojiPicker }"
                @mousedown.prevent="toggleEmojiPicker"
              >
                <svg
                  style="width:20px;height:20px"
                  viewBox="0 0 24 24"
                >
                  <path fill="#888888" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
                </svg>
              </span>

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
import { Picker } from 'emoji-mart-vue'

export default {
  name: 'ChatWindow',
  components: {
    chat: require('components/Messages/Chat.vue').default,
    noMessages: require('components/Shared/NoRecords.vue').default,
    Picker
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
      showNewMessageButton: false,
      showEmojiPicker: false
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
        const textarea = this.$refs.textarea.$refs.input
        textarea.focus()
      } catch (error) {
        showMessage('Error', `Error saving new message to Firebase Database: ${error.message}`)
      }
    },
    toggleEmojiPicker () {
      this.showEmojiPicker = !this.showEmojiPicker
    },
    addEmoji (emoji) {
      let text = '',
        cursorPosition = 0,
        start = 0,
        end = 0
      const textarea = this.$refs.textarea.$refs.input
      if (textarea) {
        cursorPosition = textarea.selectionEnd
        start = this.message.text.substring(0, textarea.selectionStart)
        end = this.message.text.substring(textarea.selectionStart)
      }
      text = start + emoji.native + end
      this.message.text = text
      this.toggleEmojiPicker()
      textarea.focus()
      this.$nextTick(() => {
        textarea.selectionEnd = cursorPosition + emoji.native.length
      })
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
    .textarea-emoji-picker {
      position: relative;
      width: 30rem;
      margin: 0 auto;
    }
    .textarea {
      width: 100%;
      max-height: 7rem;
      outline: none;
      box-shadow: none;
      padding: 1rem 2.8rem 1rem 1rem;
      font-size: 1.5rem;
      border: 1px solid #BABABA;
      color: #333;
      border-radius: 2px;
      box-shadow: 0px 2px 4px 0 rgba(0,0,0,0.1) inset;
      resize: vertical;
    }
    .emoji-mart {
      position: absolute;
      top: -42rem;
      right: 1rem;
    }
    .emoji-trigger {
      position: absolute;
      top: 1rem;
      right: 1rem;
      cursor: pointer;
      height: 2rem;
    }
    .emoji-trigger path {
      transition: 0.1s all;
    }
    .emoji-trigger:hover path {
      fill: #000000;
    }
    .emoji-trigger.triggered path {
      fill: darken(#FEC84A, 15%);
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
