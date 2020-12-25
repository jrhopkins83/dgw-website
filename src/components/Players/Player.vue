<template>
  <div>
    <li
      class="item item-container player-table__items q-mt-xs" :class="isAdmin">
      <div class="attribute-container avatar">
        <div class="attribute player-img q-px-sm q-py-xs">
          <q-avatar>
            <img :src="player_avatar" color="primary">
          </q-avatar>
        </div>
      </div>
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container player-information">
        <div class="attribute-container player-names">
          <div class="attribute name q-ml-sm">{{ player.firstName }}</div>
          <div class="attribute name">{{ player.lastName }}</div>
          <div class="attribute nick-name">{{ player.nickName}}</div>
          <div class="attribute online-name">{{ player.onlineName }}</div>
        </div>
      </div>
      <div class='attribute-container contact-info' v-if="adminButtons">
        <div class='attribute email q-ml-sm'>{{ player.email}}</div>
        <div class='attribute games gt-xs'>{{ player.phoneNumber }}</div>
      </div>
      <div class="attribute-container admin-buttons" v-if="adminButtons" >
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
      </div>
    </li>
  </div>

</template>

<script>

export default {
  name: 'Player',
  props: {
    player: Object,
    id: String,
    isAdmin: String,
    adminButtons: Boolean
  },
  data () {
    return {

    }
  },
  computed: {
    screenWidth () {
      return this.$q.screen.width
    },
    player_avatar: function () {
      if (this.player.avatar) {
        return this.player.avatar
      } else {
        return 'default.jpg'
      }
    }
  },
  methods: {
    selectPlayer () {
      this.$emit('select', this.player.playerID)
    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>
  .players-section {

    li {
      list-style: none;
    }

      .item-container.isAdmin {
          display: grid;
          grid-template-columns: 5em 3fr 2fr 9rem;
          grid-gap: 4px;

      }

      .item-container.isNotAdmin {
          display: grid;
          grid-template-columns: 5em 1fr;

      }

      .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
        border: solid;
        border-width: 1px;
        border-color: white;

          .attribute {
            display: flex;
            align-self: center;
            color: white;
            font-weight: 700;
          }

      }

      .attribute-container.contact-info {
        grid-template-columns: 3.5fr 2fr;
      }

      .attribute-container.avatar {
        align-self: center;
        justify-self: center;
      }

      /* Definition of wrapping column width for attribute groups. */
      .player-information {
          --column-width-min: 6.2em;
      }

      .contact-info {
          --column-width-min: 5.2em;
      }

      .admin-buttons {
          --column-width-min: 2em;
      }

    &__players {

      .player-table {

        &__items {
          border-radius: 9px;
          margin-bottom: 8px;

        }
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

</style>
