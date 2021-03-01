<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <div class="container">
        <update-player-profile
          :playerToEdit="userInfo"
          :editor="'user'"
          :mode="mode"
          :editMode="editMode"
          @saveChanges="saveChanges"
          @close="closeEditor"
        >
          Update Profile
        </update-player-profile>
      </div>
    </transition>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showMessage } from 'src/functions/functions-common'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'

export default {
  name: 'EditProfile',
  components: {
    updatePlayerProfile: require('components/Players/Modals/ModalUpdatePlayer.vue').default
  },
  mixins: [mixinAddEditPlayer],
  data () {
    return {
      mode: 'edit',
      heading: 'Contact Info',
      editMode: 'edit',
      showChangePhoto: false,
      imageType: ''
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfoLoaded', 'userInfo'])
  },
  methods: {
    ...mapActions('leagueSettings', ['setUserInfo', 'saveUserInfoLS']),
    closeEditor () {
      this.showEditPlayer = false
      this.playerToEdit = {}
      this.$router.go(-1)
    },
    async saveChanges (playerToSubmit) {
      this.$q.loading.show({
        message: `<b>Player ${this.editMode}</b> is in progress.<br/><span class="text-info">Hang on...</span>`
      })
      try {
        await this.savePlayer(playerToSubmit)
        if (playerToSubmit.avatarChanged) {
          const playerAvatar = {
            avatar: {
              avatarUrl: playerToSubmit.avatar.avatarUrl,
              avatarName: playerToSubmit.avatar.avatarName
            }
          }
          this.setUserInfo(playerAvatar)
        }
        if (playerToSubmit.photoChanged) {
          const playerPhoto = {
            photo: {
              photoUrl: playerToSubmit.photo.photoUrl,
              photoName: playerToSubmit.photo.photoName
            }
          }
          this.setUserInfo(playerPhoto)
        }

        showMessage('Success', `Player ${this.editMode} complete`)
        this.$q.loading.hide()
        this.$router.go(-1)
      } catch (error) {
        showMessage('error', `Error ${this.editMode}ing player - ${error}`)
        this.$q.loading.hide()
      }
    }

  },
  async beforeMount () {

  }
}

</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }
  .container {
    display: flex;              /* establish flex container */
    flex-direction: column;     /* stack flex items vertically */
    justify-content: center;    /* center items vertically, in this case */
    align-items: center;        /* center items horizontally, in this case */
    height: 92vh;

    .outline {
      height: 79vh;
      width: 64vw;
      background-color: $off-white;

      .header {
        position: relative;
        width: 100%;
        height: 43px;

        &__title {
          height: 27px;
          margin: 5px;
        }

      }

      .profile-section {
        height: 60rem;

        &__photo {
          margin-top: .8rem;
          height: 57rem;
        }

        &__user-info {
          margin-top: .8rem;
          height: 57rem;
        }

      }
    }
    .profile {
      height: 60%;
      width: 60%;
      border: solid black;
      align-self: center;
    }

  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;

    }

  }
</style>
