<template>
  <div class="message-grid" :class="sameUser">
    <div v-if="message.avatarUrl.length > 0">
      <q-avatar class="message__avatar">
        <img :src="message.avatarUrl" color="primary">
      </q-avatar>
    </div>
    <div v-else>
      <q-avatar
        color="blue-10"
        size="24px"
        text-color="white"
      >
        {{ player_first_initial }}
      </q-avatar>
    </div>
      <div class="message__text" :class="sameUser" >
        <div class="message__text--wrapper" :class="sameUser">
          {{ message.text}}
        </div>
      </div>
      <div class="message__sender" :class="sameUser">
        {{ message.playerName}}
      </div>
      <div class="message__date-time" :class="sameUser">
        {{ dateTime}}
      </div>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'Chat',
  props: ['message', 'uid'],
  computed: {
    sameUser: function () {
      if (this.message.uid === this.uid) {
        return 'same-user'
      } else {
        return 'not-same-user'
      }
    },
    player_first_initial: function () {
      return this.message.playerName.substr(0, 1)
    },
    dateTime: function () {
      let formattedDtTm = ''
      const today = new Date()
      const dateToday = date.formatDate(today, 'MM/DD/YYYY')
      const postedDateTm = this.message.timestamp.toDate()
      const datePosted = date.formatDate(postedDateTm, 'MM/DD/YYYY')
      if (dateToday !== datePosted) {
        formattedDtTm = date.formatDate(this.message.timestamp.toDate(), 'ddd MMM Do, h:mm a')
      } else {
        formattedDtTm = date.formatDate(this.message.timestamp.toDate(), 'h:mm a')
      }
      return formattedDtTm
    }
  }
}
</script>

<style lang="scss" scoped>
.message-grid {
  display: grid;
  grid-template-columns: 3.5rem 1fr 1fr 2fr;
  grid-template-rows: max-content 2.5em;
  gap: 0px 0px;
  grid-template-areas:
    "avatar message message message"
    ". sender date-time .";
}

.message-grid.not-same-user {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 3.5rem;
  grid-template-rows: 1fr .5fr;
  gap: 0px 4px;
  grid-template-areas:
    "message message message avatar"
    ". date-time sender .";
}

  .message {

    &__avatar {
      grid-area: avatar;
      font-size: 2.5rem;
    }

    &__text {
      grid-area: message;
      justify-self: flex-start;

      &--wrapper {
        background-color: $green-1;
        padding: 1rem;
        border: $icon-grey solid .5px;
        border-radius: 5px;
      }

      &--wrapper.not-same-user {
        background-color:$light-blue-3;
      }
    }

    &__text.not-same-user {
      justify-self: flex-end;
    }

    &__sender {
      grid-area: sender;
      font-size: 12px;
    }

    &__sender.not-same-user {
      justify-self: flex-end;
    }

    &__date-time {
      justify-self: flex-start;
      grid-area: date-time;
      font-size: 12px;
    }

    &__date-time.not-same-user {
      justify-self: flex-end;
    }

  }

  @media screen and (max-width: 364px) {
    .message-grid {
      grid-template-columns: 3.5rem 1fr 1fr;
      grid-template-rows: max-content 2.5em;
      gap: 0px 0px;
      grid-template-areas:
        "avatar message message"
        ". sender date-time";
    }

    .message-grid.not-same-user {
      display: grid;
      grid-template-columns: 1fr 1fr 3.5rem;
      grid-template-rows: max-content 2.5em;
      gap: 0px 4px;
      grid-template-areas:
        "message message avatar"
        "date-time sender .";
    }

  }

</style>
