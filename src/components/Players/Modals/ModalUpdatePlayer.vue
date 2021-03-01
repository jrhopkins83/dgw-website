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
          <div class="col-2 profile-section__photo q-px-xs" v-if="editMode === 'edit'">
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
              v-model="playerToEdit"
              ref="playerForm"
              :heading="heading"
              :mode="'profile'"
              :createUser.sync="createUser"
              @close="$emit('close')"
            />

          </div>
        </div>
        <div class="row actions">
          <div class="col-12 actions__buttons">
            <q-card-actions align="center">
              <q-btn
                label="Submit"
                color="blue-9"
                @click="submitForm"
              />

              <q-btn
                label="Cancel"
                color="primary"
                @click="$emit('close')"
              />
            </q-card-actions>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showChangePhoto">
      <modal-change-photo
        :editor="editor"
        :player="playerToEdit"
        @updateImage="updateImage"
        :imageType="imageType"
        @close="showChangePhoto=false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { toTitleCase } from 'src/functions/functions-common'

export default {
  name: 'EditProfile',
  components: {
    modalChangePhoto: require('components/Players/Modals/ModalChangePhoto.vue').default,
    editPlayer: require('components/Players/Modals/ModalAddEditPlayer .vue').default
  },
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
      playerAvatar: {
        avatarUrl: '',
        avatarName: ''
      },
      avatarChanged: false,
      playerPhoto: {
        photoUrl: '',
        photoName: ''
      },
      photoChanged: false,
      imageType: '',
      image: {
        url: '',
        name: ''
      },
      formHasError: false,
      createUser: false
    }
  },
  computed: {
    player_avatar: function () {
      if (this.playerAvatar.avatarUrl) {
        return this.playerAvatar.avatarUrl
      } else {
        return 'default.jpg'
      }
    },
    player_photo: function () {
      if (this.playerPhoto.photoUrl) {
        return this.playerPhoto.photoUrl
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
    updateImage (image) {
      if (this.imageType === 'avatar') {
        this.playerAvatar = {
          avatarUrl: image.imageUrl,
          avatarName: image.imageName
        }
        this.avatarChanged = true
      } else {
        this.playerPhoto = {
          photoUrl: image.imageUrl,
          photoName: image.imageName
        }
        this.photoChanged = true
      }
    },
    async submitForm () {
      this.$refs.playerForm.$refs.first.validate()
      this.$refs.playerForm.$refs.last.validate()
      this.$refs.playerForm.$refs.email.validate()

      // if (this.$v.$invalid) {
      //   this.$nextTick(() => this.focusFirstStatus())
      if (this.$refs.playerForm.$refs.first.hasError ||
        this.$refs.playerForm.$refs.last.hasError ||
        this.$refs.playerForm.$refs.email.hasError) {
        this.formHasError = true
      }

      let nickName = null
      let onlineName = null

      if (!this.formHasError) {
        if (this.playerToEdit.nickName) {
          nickName = this.playerToEdit.nickName.trim()
        }

        if (this.playerToEdit.onlineName) {
          onlineName = this.playerToEdit.onlineName.trim()
        }

        const playerToSubmit = {
          playerID: this.playerToEdit.playerID,
          avatar: this.playerAvatar,
          avatarChanged: this.avatarChanged,
          photo: this.playerPhoto,
          photoChanged: this.photoChanged,
          firstName: toTitleCase(this.playerToEdit.firstName).trim(),
          lastName: toTitleCase(this.playerToEdit.lastName).trim(),
          email: this.playerToEdit.email,
          phoneNumber: this.playerToEdit.phoneNumber,
          nickName: nickName,
          onlineName: onlineName,
          emailOptin: this.playerToEdit.emailOptin,
          createUser: this.createUser
        }

        this.$emit('saveChanges', playerToSubmit)
      }
    }
  },
  async beforeMount () {
    if (this.playerToEdit.avatar) {
      this.playerAvatar = this.playerToEdit.avatar
    }
    if (this.playerToEdit.photo) {
      this.playerPhoto = this.playerToEdit.photo
    }
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
      height: 48rem;

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
