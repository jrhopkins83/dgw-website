<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <div class="container">
        <update-player-profile
          :player="userInfo"
          :editor="'user'"
          @submit="savePlayer"
          @close="$router.go(-1)"
        >
          Edit Player
        </update-player-profile>
      </div>
    </transition>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
// import { firebaseStore } from 'src/boot/firebase'

export default {
  name: 'EditProfile',
  components: {
    updatePlayerProfile: require('components/Players/Modals/ModalUpdatePlayer.vue').default
  },
  data () {
    return {
      heading: 'Contact Info',
      showChangePhoto: false,
      imageType: ''
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfoLoaded', 'userInfo']),
    player: function () {
      return this.userInfo
    },
    user_avatar: function () {
      if (this.player.avatar.avatarUrl) {
        return this.player.avatar
      } else {
        const image = {
          avatarUrl: 'default.jpg',
          avatarName: 'default.jpg'
        }
        return image
      }
    },
    user_photo: function () {
      if (this.player.photo.photoUrl) {
        return this.player.photo
      } else {
        const image = {
          photoUrl: 'default.jpg',
          photoName: 'default.jpg'
        }
        return image
      }
    }
  },
  methods: {
    ...mapActions('leagueSettings', ['setUserInfo', 'saveUserInfoLS']),
    changePhoto () {
      this.imageType = 'photo'
      this.showChangePhoto = true
    },
    changeAvatar () {
      this.imageType = 'avatar'
      this.showChangePhoto = true
    },
    async savePlayer (player) {
      this.$q.loading.show({
        message: '<b>Adding New Players</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      const playerNames = {
        firstName: player.firstName,
        lastName: player.lastName,
        nickName: player.nickName,
        onlineName: player.onlineName
      }
      const playerRef = firebaseStore.collection('players').doc(this.player.playerID)
      await playerRef.update(playerNames)
      this.setUserInfo(playerNames)

      const playerContactInfo = {
        email: player.email,
        phoneNumber: player.phoneNumber,
        emailOptin: player.emailOptin,
        notificationOptin: player.notificationOptin
      }
      const userRef = firebaseStore.collection('subscribers').doc(this.player.playerID)
      await userRef.update(playerContactInfo)
      this.setUserInfo(playerContactInfo)
      this.saveUserInfoLS()

      this.$q.loading.hide()
      showMessage('Success', 'Profile updated')
      this.$router.go(-1)
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
