<template>
  <div class="outline">
    <q-card class="my-card">
      <q-card-section>
      <div class="row header">
        <div class="col-12 header__title">
          <div class="header__title text-center text-h3 text-bold q-mt-md">
            <slot></slot>
          </div>
        </div>
      </div>
      <div class="row profile-section q-pa-md">
        <div class="col-2 profile-section__photo q-px-xs">
        <!-- <div class="col-2 profile-section__photo q-px-xs" v-if="editMode === 'edit'"> -->
          <div class="photo-area">
            <div class="text-center q-mb-xl">
              <q-avatar size="78px">
                <img :src="player_avatar">
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
                <img :src="player_photo">
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
            :player="playerToEdit"
            :heading="heading"
            :mode="'profile'"
            @submit="submitPlayer"
            @close="$emit('close')"
          />

        </div>
      </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showChangePhoto">
      <modal-change-photo
        :editor="editor"
        :player="playerToEdit"
        :imageType="imageType"
        @close="showChangePhoto=false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { showMessage } from 'src/functions/functions-common'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'

export default {
  name: 'EditProfile',
  components: {
    modalChangePhoto: require('components/Players/Modals/ModalChangePhoto.vue').default,
    editPlayer: require('components/Players/Modals/ModalAddEditPlayer .vue').default
  },
  mixins: [mixinAddEditPlayer],
  props: {
    playerToEdit: {
      type: Object
    },
    editor: {
      type: String
    },
    editMode: {
      type: String
    }
  },
  data () {
    return {
      mode: '',
      heading: 'Contact Info',
      showChangePhoto: false,
      imageType: '',
      image: {
        url: '',
        name: ''
      }
    }
  },
  computed: {
    player_avatar: function () {
      if (this.playerToEdit.avatar.avatarUrl) {
        return this.playerToEdit.avatar.avatarUrl
      } else {
        return 'default.jpg'
      }
    },
    player_photo: function () {
      if (this.playerToEdit.photo.photoUrl) {
        return this.playerToEdit.photo.photoUrl
      } else {
        return 'default.jpg'
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
    async submitPlayer (playerToSubmit) {
      this.$q.loading.show({
        message: `<b>Player ${this.editMode}</b> is in progress.<br/><span class="text-info">Hang on...</span>`
      })
      try {
        await this.savePlayer(playerToSubmit)
        showMessage('Success', `Player ${this.editMode} complete`)
        this.$q.loading.hide()
        this.$emit('close')
      } catch (error) {
        showMessage('error', `Error adding player - ${error}`)
        this.$q.loading.hide()
        this.$emit('close')
      }
    }
  },
  created () {
    this.mode = this.$route.params.mode
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

  @media (min-width: 600px) {
    .q-dialog__inner--minimized > div.outline {
      max-width: 75rem;
    }
    .q-dialog__inner--minimized > div.photo-form {
      max-width: 105rem;
    }
  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;

    }

  }
</style>
