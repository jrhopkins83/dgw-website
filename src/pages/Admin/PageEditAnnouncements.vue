<template>
  <div>
    <q-page>
      <div class="container">
        <div class="left-image">
        </div>
        <div class="headline text-h2 text-white text-bold text-center">
          Donkeys Gone Wild News & Announcements
        </div>
        <div class="right-image">

        </div>
        <div class="announcements">
          <q-scroll-area
            class="item-list"
            visible
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
          >
            <news-item
              v-for="announcement in announcements"
              :key="announcement.id"
              :item="announcement"
              :isAdmin="userInfo.isAdmin"
              @editItem="editAnnouncement"
              @deleteItem="confirmDelete"
            >
          <!-- <news-item> -->
            </news-item>
          </q-scroll-area>

          <div class="add-button absolute-bottom text-center no-pointer-events">
            <q-btn
              @click="addAnnouncement"
              round
              class="all-pointer-events"
              color="teal-10"
              size="20px"
              icon="add"
            />
          </div>
        </div>
      </div>
      <q-dialog
        v-model="showAddEdit"
      >
        <announcement-details
          :announcement="announcement"
          :mode="mode"
          @save="saveAnnouncement"
          @close="showEditAnnouncement=false"
        />
      </q-dialog>
      <q-dialog
        v-model="confirm"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h3">
              {{ dialogHeader}}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ dialogMsg }}
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              @click="deleteAnnouncement"
              color="blue-10"
              label="Confirm"
            />
            <q-btn
              v-close-popup
              color="negative"
              label="Cancel"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { firebaseStore } from 'src/boot/firebase'
import { showMessage } from 'src/functions/functions-common'

export default {
  name: 'PageEditAnnouncements',
  components: {
    newsItem: require('src/components/News/announcement.vue').default,
    // modalConfirm: require('src/components/Modals/Shared/ModalConfirmDialog.vue').default,
    announcementDetails: require('src/components/Admin/EditAnnouncement.vue').default
  },
  data () {
    return {
      showAddEdit: false,
      confirm: false,
      dialogHeader: '',
      dialogMsg: '',
      mode: '',
      announcement: {},
      id: '',
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#B8D2C7',
        width: '5px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['userInfo']),
    ...mapGetters('announcements', ['announcementsLoaded', 'announcements']),
    announcementsList: function () {
      return this.announcements
    }
  },
  methods: {
    ...mapActions('announcements', ['setAnnouncementsLoaded']),
    addAnnouncement () {
      this.mode = 'add'
      this.showAddEdit = true
    },
    editAnnouncement (value) {
      this.mode = 'edit'
      this.announcement = value[0]
      this.showAddEdit = true
    },
    confirmDelete (value) {
      this.announcement = value[0]
      this.dialogHeader = 'Confirm Delete?'
      this.dialogMsg = `Are you sure you want to delete this announcement subject: ${this.announcement.subject}?`
      this.confirm = true
    },
    async deleteAnnouncement () {
      this.setAnnouncementsLoaded(false)
      this.$q.loading.show({
        message: '<b>Adding New Announcements</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      try {
        const announcementID = this.announcement.id
        const announcementsRef = firebaseStore.collection('announcements')
        await announcementsRef.doc(announcementID).delete()
        this.setAnnouncementsLoaded(true)
        this.announcement = {}
        this.showAddEdit = false
        this.$q.loading.hide()
      } catch (err) {
        switch (err) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Announcement not found in database')
            break
          default:
            showMessage('error', 'Error delete announcement: ' + err)
        }
      }
    },
    async saveAnnouncement (announcement) {
      this.setAnnouncementsLoaded(false)
      this.confirm = false
      this.$q.loading.show({
        message: '<b>Adding New Announcements</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      try {
        const announcementID = announcement.id
        const saveAnnouncement = {
          subject: announcement.subject,
          newsText: announcement.newsText,
          heroHeadline: announcement.heroHeadline,
          postedDate: announcement.postedDate
        }
        const announcementsRef = firebaseStore.collection('announcements')
        if (this.mode === 'add') {
          await announcementsRef.add(saveAnnouncement)
        } else {
          await announcementsRef.doc(announcementID).update(saveAnnouncement)
        }
        this.setAnnouncementsLoaded(true)
        this.announcement = {}
        this.showAddEdit = false
        this.$q.loading.hide()
      } catch (err) {
        switch (err) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error saving announcement: ' + err)
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

  .container {
    position: relative;
    height: 93vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 10rem 1fr;
    grid-template-areas:
      "headerLeft headline headline ."
      ". announcements announcements .";

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent radial-gradient(closest-side at 50% 50%, #2fa690 0%, #0D6238 100%) 0% 0% no-repeat padding-box;
      background-repeat: no-repeat;
      // background-size: 60% 100%;
    }

    .left-image {
      grid-area: headerLeft;
      position: relative;
      min-height: 10rem;
      width: 10rem;
      top: 1rem;
      right: 0px;
      bottom: 0px;
      left: 1rem;
      background-image: url(news-icon-white.png);
      background-repeat: no-repeat;
      background-size: cover;
    }

    .headline {
      grid-area: headline;
      position: sticky;
    }

    .right-image {
      position: relative;
      min-height: 16rem;
      width: 100%;
      top: 3rem;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-image: url(big-slick-green.png);
      background-repeat: no-repeat;
      background-size: cover;
    }

    .announcements {
      grid-area: announcements;
      background-color: $off-white;
      // height: 85vh;
      // overflow: hidden;

      .item-list {
        height: 85vh;
        width: 100%;
        overflow: scroll;
      }

    }
    .add-button {
      margin-bottom: 2rem;
      width: 100%;
    }

  }
</style>
