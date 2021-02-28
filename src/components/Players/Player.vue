<template>
  <div>
    <li
      class="item item-container item-row q-mt-xs" :class="isAdmin">
      <div class="attribute-container avatar">
        <div class="attribute player-img q-px-sm q-py-xs">
          <q-avatar>
            <img :src="player_avatar" color="primary">
          </q-avatar>
        </div>
      </div>
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container player-names q-pl-xs">
        <div class="attribute name">{{ player.firstName }}</div>
        <div class="attribute name">{{ player.lastName }}</div>
        <div class="attribute nick-name">{{ player.nickName}}</div>
        <div class="attribute online-name">{{ player.onlineName }}</div>
      </div>
      <div class='attribute-container contact-info q-pl-xs' v-if="adminButtons">
        <div class='attribute email'>{{ player.email}}</div>
        <div class='attribute phone gt-xs'>{{ player.phoneNumber }}</div>
      </div>
      <div class="attribute-container admin-buttons" v-if="adminButtons" >
        <div class="attribute edit">
          <q-btn
            icon="edit"
            flat
            size="md"
            @click="$emit('editPlayer', [player])"
          />
        </div>
        <div class="attribute delete">
          <q-btn
            icon="delete"
            flat
            size="md"
            @click="$emit('deletePlayer', [player, id])"
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
      if (this.player.photo.photoUrl) {
        return this.player.photo.photoUrl
      } else {
        return 'default.jpg'
      }
    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>
  .players-section {

    * {
      box-sizing: border-box;
    }

    &__players {
      // background-color: white;
      position: relative;
      height: 85%;
      max-width: 80rem;
      overflow: auto;
      border-radius: 2.5rem;
      opacity: .9;

      &--table {

        .item-container.isAdmin {
          display: grid;
          grid-template-columns: 5em 2.5fr 2fr 8rem;
          grid-gap: 4px;
        }

        .item-container.isNotAdmin {
          display: grid;
          grid-template-columns: 5em 1fr;
          grid-gap: 4px;
        }

        .item-row {

          .attribute-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
            border: solid;
            border-width: 1px;
            border-color: white;

            .attribute {
              display: flex;
              align-self: end;
              align-self: center;
              font-weight: 700;

              .q-avatar {
                font-size: 64px;
              }
            }
            .attribute.phone {
              justify-self: center;
            }
          }

          /* Definition of wrapping column width for attribute groups. */
          .attribute-container.player-names {
            --column-width-min: 7.2em;
          }

          .attribute-container.contact-info {
            --column-width-min: 5.2em;
          }

          .attribute-container.admin-buttons {
            grid-template-columns: repeat(2, 1fr);
            justify-self: center;
          }

        }
      }
    }

    &__players.isAdmin {
      max-width: 110rem;
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 450px) {
  .q-avatar {
    font-size: 54px !important;
  }
}

@media screen and (max-width: 383px) {
  .player-names {
    --column-width-min: 9rem !important;
  }
}
</style>
