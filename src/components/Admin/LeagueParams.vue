<template>
  <div class="q-pa-xs row items-start q-gutter-xs">
    <q-card>
      <q-card-section>
        <q-card-section class="q-pa-xs">
          <div class="text-subtitle1 text-weight-bold text-center">Set League Parameters </div>
        </q-card-section>
      <q-separator />
        <q-form
          @submit.prevent="onSubmit"
          class="q-gutter-md"
        >
          <div class="row">

            <div class="col-6">
              <q-card class="params">
                <q-card-section>
                  <div class="text-subtitle2">Update Scoring Parameters</div>
                </q-card-section>

                <q-separator
                  dark
                  inset
                />

                <q-card-section class="q-pt-none">
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="maxPlayers"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Max Players"
                    stack-label
                    :options="maxPlayersOpts"
                  />
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="maxOverPar"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Max Over Par"
                    stack-label
                    :options="maxPlayersOpts"
                  />
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="maxPutts"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Max Putts"
                    stack-label
                    :options="maxPuttsOpts"
                  />
                </q-card-section>
                <q-card-section class="q-mt-sm q-pt-lg">
                  <q-btn
                    color="primary"
                    label="Update"
                    type="submit"
                  />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card class="params">
                <q-card-section>
                  <div class="text-subtitle2">Update Points Assignment</div>
                </q-card-section>

                <q-separator
                  dark
                  inset
                />

                <q-card-section class="q-pt-none">
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="eagle"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Eagle"
                    stack-label
                    :options="pointsOpts"
                  />
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="birdie"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Birdie"
                    stack-label
                    :options="pointsOpts"
                  />
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="par"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Par"
                    stack-label
                    :options="pointsOpts"
                  />
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="bogie"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Bogie"
                    stack-label
                    :options="minusPointsOpts"
                  />
                  <q-select
                    dense
                    outlined
                    fill-input
                    v-model="double"
                    class=“no-pointer-events”
                    input-class="text-center"
                    label="Double or more"
                    stack-label
                    :options="minusPointsOpts"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['LeagueInfo', 'points']),
    maxPlayers: {
      get () {
        return this.LeagueInfo.maxPlayers
      },
      set (value) {
        this.setMaxPlayers(value)
      }
    },
    maxOverPar: {
      get () {
        return this.LeagueInfo.maxOverPar
      },
      set (value) {
        this.setMaxOverPar(value)
      }
    },
    maxPutts: {
      get () {
        return this.LeagueInfo.maxPutts
      },
      set (value) {
        this.setMaxPutts(value)
      }
    },
    eagle: {
      get () {
        return this.LeagueInfo.points.eagle
      },
      set (value) {
        const payload = {
          key: 'eagle',
          value: value
        }
        this.setPoints(payload)
      }
    },
    birdie: {
      get () {
        return this.LeagueInfo.points.birdie
      },
      set (value) {
        const payload = {
          key: 'birdie',
          value: value
        }
        this.setPoints(payload)
      }
    },
    par: {
      get () {
        return this.LeagueInfo.points.par
      },
      set (value) {
        const payload = {
          key: 'par',
          value: value
        }
        this.setPoints(payload)
      }
    },
    bogie: {
      get () {
        return this.LeagueInfo.points.bogie
      },
      set (value) {
        const payload = {
          key: 'bogie',
          value: value
        }
        this.setPoints(payload)
      }
    },
    double: {
      get () {
        return this.LeagueInfo.points.double
      },
      set (value) {
        const payload = {
          key: 'bogie',
          value: value
        }
        this.setPoints(payload)
      }
    },
    maxOverParOpts: function () {
      const nums = []
      for (let i = 1; i < 5; i++) {
        nums.push(i)
      }
      return nums
    },
    maxPuttsOpts: function () {
      const nums = []
      for (let i = 1; i <= 5; i++) {
        nums.push(i)
      }
      return nums
    },
    maxPlayersOpts: function () {
      const nums = []
      for (let i = 1; i <= 5; i++) {
        nums.push(i)
      }
      return nums
    },
    pointsOpts: function () {
      const nums = []
      for (let i = 0; i <= 5; i++) {
        nums.push(i)
      }
      return nums
    },
    minusPointsOpts: function () {
      const nums = []
      for (let i = 0; i >= -5; i--) {
        nums.push(i)
      }
      return nums
    }
  },
  methods: {
    ...mapActions('leagueSettings', ['setMaxPlayers', 'setMaxOverPar', 'setMaxPutts', 'setEaglePoints', 'setPoints', 'fbUdateLeagueParams']),
    onSubmit () {
      const payload = {
        maxPlayers: this.maxPlayers,
        maxOverPar: this.maxOverPar,
        maxPutts: this.maxPutts,
        points: {
          eagle: this.eagle,
          birdie: this.birdie,
          par: this.par,
          bogie: this.bogie,
          double: this.double,
          other: this.double
        }
      }
      this.fbUdateLeagueParams(payload)
    }
  }
}
</script>

<style scoped>
  .params {
    height: 305px;
  }
</style>
