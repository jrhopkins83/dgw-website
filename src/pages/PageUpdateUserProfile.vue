<template>
  <q-page style="min-height: inherit;">
    <div
      class="container"
      v-if="leagueInfoLoaded"
    >
      <div class="outline">
        <div class="row header">
          <div class="col-12 header__title">
            <div class="header__title text-center text-h3 text-bold q-mt-md">
              Edit Profile
            </div>
          </div>
        </div>
        <div class="row profile-section q-pa-md">
          <div class="col-2 profile-section__photo q-px-xs">
            <div class="text-center">
              <q-avatar size="78px">
                <img :src="user_avatar">
              </q-avatar>
              <q-btn
                color="grey-10"
                no-caps
                label="Change Photo"
                class="q-mt-md"
                @click="showChangePhoto=true"
              />
            </div>
          </div>
          <div class="col-10 profile-section__user-info q-px-md">
            <edit-player
              :player="userInfo"
              :heading="heading"
              :mode="'profile'"
              @save="savePlayer"
            />

          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="showChangePhoto">
      <modal-change-photo
        :image="userInfo.avatar.url"
        :itemId="userInfo.avatar.id"
        :userInfo="userInfo"
        @close="showChangePhoto=false"
      />
    </q-dialog>
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
    editPlayer: require('components/Players/Modals/ModalAddEditPlayer .vue').default,
    modalChangePhoto: require('components/Players/Modals/ModalChangePhoto.vue').default
  },
  data () {
    return {
      heading: 'Contact Info',
      showChangePhoto: false
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfoLoaded', 'userInfo']),
    user: function () {
      const user = {
        avatar: this.userInfo.avatar,
        email: this.userInfo.email,
        emailOptin: this.userInfo.emailOptin,
        firstName: this.userInfo.firstName,
        isAdmin: this.userInfo.isAdmin,
        lastName: this.userInfo.lastName,
        nickName: this.userInfo.nickName,
        notificationOptin: this.userInfo.notificationOptin,
        onlineName: this.userInfo.onlineName,
        phoneNumber: this.userInfo.phoneNumber,
        playerID: this.userInfo.playerID,
        uid: this.userInfo.uid
      }
      return user
    },
    user_avatar: function () {
      if (this.userInfo.avatar) {
        return this.userInfo.avatar
      } else {
        return 'default.jpg'
      }
    }
  },
  methods: {
    ...mapActions('leagueSettings', ['setUserInfo', 'saveUserInfoLS']),
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
      const playerRef = firebaseStore.collection('players').doc(this.userInfo.playerID)
      await playerRef.update(playerNames)
      this.setUserInfo(playerNames)

      const playerContactInfo = {
        email: player.email,
        phoneNumber: player.phoneNumber,
        emailOptin: player.emailOptin,
        notificationOptin: player.notificationOptin
      }
      const userRef = firebaseStore.collection('subscribers').doc(this.userInfo.playerID)
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
