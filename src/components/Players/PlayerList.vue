<template>
  <div>
    <section class='players-section'>
      <div class='players-section__players q-mb-sm' :class="isAdmin">
        <ol class='collection collection-container players-section__players--table q-mb-sm' :class="isAdmin">
          <!-- The first list item is the header of the table -->
          <li class='item item-container heading-row q-pb-sm' :class="isAdmin">
            <div class='attribute-container avatar'>
              <div class='attribute player-img'>Photo</div>
            </div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
              <div class='attribute-container player-names q-pl-xs'>
                <div class='attribute firstName'>First Name</div>
                <div class='attribute lastName'>Last Name</div>
                <div class='attribute nick-name'>Nickname</div>
                <div class='attribute online-name'>Online Name</div>
              </div>
            <div class='attribute-container contact-info q-pl-xs' v-if="adminButtons">
              <div class='attribute email'>eMail</div>
              <div class='attribute phone gt-xs'>Phone</div>
            </div>
              <div class="attribute-container admin-buttons text-center" v-if="adminButtons" >
                <div class="attribute edit">Actions</div>
              </div>
          </li>
          <player-row
            v-for='(player, playerID) in playerList'
            :key='playerID'
            :player='player'
            :id='player.playerID'
            :isAdmin="isAdmin"
            :adminButtons="adminButtons"
            @editPlayer="editPlayer"
            @deletePlayer="confirmDelete"
          >
          </player-row>
        </ol>
      </div>
    </section>
  </div>
</template>

<script>
import { toTitleCase } from 'src/functions/functions-common'
import { mapActions } from 'vuex'

export default {
  name: 'PlayerList',
  components: {
    playerRow: require('components/Players/Player.vue').default
  },
  props: [
    'playerList',
    'isAdmin',
    'adminButtons'
  ],
  computed: {
    heading: function () {
      return `${toTitleCase(this.mode)} Player`
    }
  },
  methods: {
    ...mapActions('players', ['setPlayersLoaded']),
    editPlayer (value) {
      this.mode = 'edit'
      this.player = value[0]
      this.$emit('editPlayer', [this.player, this.mode])
    },
    confirmDelete (value) {
      this.player = value[0]
      this.$emit('deletePlayer', [this.player])
    }
  }
}
</script>

<style lang="scss" scoped>
  .players-section {
    position: relative;
    font-size: 18px;

    * {
      box-sizing: border-box;
    }

    &__players {
      position: relative;
      width: 100%;
      height: 92%;
      opacity: .9;
      display: grid;
      grid-template-columns: 1fr;

      &--table {
        margin: 0;
        position: relative;
        max-width: 120rem;
        padding: 0px;

        .no-games {
          max-width: 90vw;
          font-size: 2.4rem;

        }

        li {
          list-style: none;
        }

        /* Definition of wrapping column width for attribute groups. */
        .item-container.isAdmin {
          display: grid;
          grid-template-columns: 5em 2.5fr 2fr 8rem;
          grid-column-gap: 4px;
        }

        .item-container.isNotAdmin {
          display: grid;
          grid-template-columns: 5em 1fr;
          grid-gap: 4px;
        }

        .heading-row {
          position: sticky;
          top: 0;
          z-index: 1;
          // opacity: 1;
          background-color: #000;
          margin-left: 4px;
          margin-right: 4px;
          height: auto;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          overflow: auto;
          white-space: normal;
          font-weight: bold;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: grid;
          grid-column-gap: 1.6rem;

          .attribute-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
            padding: 1rem .5rem 1rem .5rem;

            .attribute {
              display: flex;
              align-self: end;
            }
            .attribute.phone {
              justify-self: center;
            }
          }
          .avatar {
            color: black;
          }
          .player-names {
            --column-width-min: 7.1em;
          }
          .contact-info {
            --column-width-min: 5.2em;
          }
          .admin-buttons {
            --column-width-min: 2em;
            justify-self: center;
          }
        }
      }
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 450px) {
  // .players-section {
  //   &__players--table {
  //     .heading-row {
  //       height: 7.5rem;
  //     }
  //   }
  // }
  .q-avatar {
    font-size: 54px;
  }
}

@media screen and (max-width: 383px) {
  .players-section {
    &__title {
      font-size: 54px;
    }
    .heading-row {
      height: 7rem;
    }
    .player-names {
      --column-width-min: 9rem !important;
    }
  }
}

</style>
