<template>
  <div class="outline">
    <div class="row header">
      <div class="col-12 header__title">
        <div class="header__title text-center text-h3 text-bold q-mt-md">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="row profile-section q-pa-md">
      <div class="col-2 profile-section__photo q-px-xs">
        <div class="photo-area">
          <div class="text-center q-mb-xl">
            <q-avatar size="78px">
              <img :src="player.avatar.avatarUrl">
            </q-avatar>
            <q-btn
              color="grey-10"
              no-caps
              label="Change Avatar"
              class="q-mt-md"
              @click="changeAvatar"
            >
              <q-tooltip content-class="bg-info">Your avatar will be displayed on all standings and results lisits</q-tooltip>
            </q-btn>
          </div>
          <div class="text-center">
            <q-avatar size="78px">
              <img :src="player.photo.photoUrl">
            </q-avatar>
            <q-btn
              color="grey-10"
              no-caps
              label="Change Photo"
              class="q-mt-md"
              @click="changePhoto"
            >
              <q-tooltip content-class="bg-info">Your avatar will be displayed on the player list</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="col-10 profile-section__player-info q-px-md">
        <edit-player
          :player="player"
          :heading="heading"
          :mode="'profile'"
          @submit="savePlayer"
          @close="$emit('close')"
        />

      </div>
    </div>
    <q-dialog v-model="showChangePhoto">
      <modal-change-photo
        :image="player_avatar.url"
        :imageName="player_avatar.name"
        :player="player"
        :imageType="imageType"
        @close="showChangePhoto=false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
// import { firebaseStore } from 'src/boot/firebase'

export default {
  name: 'EditProfile',
  components: {
    modalChangePhoto: require('components/Players/Modals/ModalChangePhoto.vue').default,
    editPlayer: require('components/Players/Modals/ModalAddEditPlayer .vue').default
  },
  props: {
    player: {
      type: Object
    }
  },
  data () {
    return {
      heading: 'Contact Info',
      showChangePhoto: false,
      imageType: ''
    }
  },
  computed: {
    player_avatar: function () {
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
    player_photo: function () {
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
      const subscriberRef = firebaseStore.collection('subscribers').doc(this.player.playerID)
      await subscriberRef.update(playerContactInfo)
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

      &__player-info {
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

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;

    }

  }
</style>
