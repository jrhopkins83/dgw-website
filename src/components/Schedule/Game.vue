<template>
  <div>
    <li class="item item-container games-section__games--items q-mt-xs" :class="isAdmin">
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container game-information">
        <div class="attribute date">{{ date_short }}</div>
        <div class="attribute buy-in">{{game.buyIn }}</div>
        <div class="attribute type">{{ game.type }}</div>
      </div>
      <div class="attribute-container game-structure">
        <div class="attribute structure">{{ game.structure}}</div>
        <a href="" @click="viewGameDetails()" class="attribute details">Details</a>
      </div>
      <div class="attribute-container game-buttons" v-if="adminButtons" >
        <div class="attribute edit">
          <q-btn
            icon="edit"
            flat
            size="md"
            @click="$emit('editGame', [game, id])"
          />
        </div>
        <div class="attribute delete">
          <q-btn
            icon="delete"
            flat
            size="md"
            @click="$emit('deleteGame', [game, id])"
          />
        </div>
        <div class="attribute invite" v-if="showButton">
          <q-btn
            icon="forward_to_inbox"
            flat
            size="md"
            @click="$emit('sendInvite', $event)"
          />
        </div>
        <div class="attribute complete" v-if="showButton">
          <q-btn
            icon="flag"
            flat
            size="md"
            @click="$emit('enterResults', id)"
          />
        </div>
      </div>
    </li>
  </div>

</template>

<script>
import { date } from 'quasar'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Games',
  props: [
    'id',
    'game',
    'isAdmin',
    'adminButtons'
  ],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['userInfo']),
    date_short: function () {
      // replace after getting data form FS
      const startDateTm = this.game.gameDate.toDate()
      const shortDate = date.formatDate(startDateTm, 'MM/DD/YY')
      return shortDate
    },
    showButton: function () {
      if (this.game.type === 'MTT' && !this.game.complete) {
        return true
      } else {
        return false
      }
    }

  },
  methods: {
    ...mapActions('tourneyResults', ['updateCheckedInGames']),
    viewGameDetails () {

    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>
  .games-section {

    li {
      list-style: none;
    }

    &__games {

      .item-container {
        display: grid;

        .attribute-container.game-information {
          display: grid;
          grid-template-columns: 8rem 6rem 6rem;
          grid-gap: 8px;
        }

        .attribute-container.game-structure {
          display: grid;
          grid-template-columns: 20rem 5rem;
        }

        .attribute-container.game-buttons {
          display: grid;
          grid-template-columns: repeat(4, 4rem);
          grid-gap: 4px;
          // grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
        }
      }
      .item-container.isAdmin {
        grid-template-columns: 1fr 1.5fr 1fr;
      }
      .item-container.isNotAdmin {
        grid-template-columns: 1fr 1.5fr;
      }

      &--items {
          border-bottom: solid $light-grey;
          margin-bottom: 8px;
      }
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .online-name-header {
    display: none;
  }
}

/* Tabular Layout */
@media screen and (min-width: 360px) {

}
</style>
