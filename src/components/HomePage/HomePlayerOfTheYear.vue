<template>
  <div class="row POYBar q-pa-xs items-center" v-if="playersLoaded && standingsLoaded">
    <div class="col-2 POYBar__row-title text-h4 text-bold text-center q-mr-sm">
        Player of the Year
    </div>

    <div class="col player-item q-pl-xs q-mr-sm"
      v-for="(player, playerID) in top4Players"
      :key=playerID
    >
      <div class="row items-center">
        <div class="col-3">
          <div class="player-img" v-if="player.avatar.avatarUrl">
            <q-avatar
              size="56px"
            >
              <img :src="player.avatar.avatarUrl" color="primary">
            </q-avatar>
          </div>
          <div class="player-img" v-else>
            <q-avatar icon="person" color="icon-grey" size="57px" />
          </div>
        </div>
        <div class="col-9">
          <div class="text-body1 text-bold">
            {{ player.firstName }} "{{ player.nickName}}""
          </div>
          <div class="text-body1 text-weight-medium q-pt-sm">
            {{ player.totalPoints }} Points
          </div>
        </div>
      </div>
    </div>

    <q-inner-loading :showing="updating">
      <q-spinner-ios
        size="2rem"
        color="blue-9"
      />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HomePlayerOfTheYear',
  props: ['standings'],
  data () {
    return {
      limit: 4,
      totalLeaders: 0
    }
  },
  computed: {
    ...mapGetters('players', ['playersLoaded']),
    ...mapGetters('standings', ['standingsLoaded']),
    updating () {
      const stillLoading = !this.standingsLoaded // TO-DO: add other loading events
      return stillLoading
    },
    top4Players () {
      const finalTableList = []

      if (this.standings) {
        for (let i = 0; i <= this.limit - 1; i++) {
          finalTableList.push(this.standings[i])
        }
      }

      return finalTableList
    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
  .POYBar {
    background-color: $off-white;
    width: 100%;
    height: 84px;

    &__row-title {
      max-width: 176px;
      border-right: 1px solid $grey-4;
    }

    &__separator {
      height: 77px;
    }
  }

  .player-img {
    border: 2px solid $primary;
    width: 61px;
    border-radius: 50%;
  }

  .player-item {
    border-right: 1px solid $grey-4
  }

  @media screen and (max-width: 1139px) {
    .POYBar__row-title {
      width: 105px;
    }
  }

</style>
