<template>
  <div class="flex-center column">
    <div class="row hero-section">
      <q-card class="hero-section__pool" flat >
        <q-card-section>
          <q-list>
            <q-item class="q-py-xs">
              <q-item-section class="text-primary text-bold">
                Final Table
              </q-item-section>
              <q-item-section class="text-weight-bold" side>
                {{ formattedFinalTable }}
              </q-item-section>
            </q-item>
            <q-item class="q-py-xs">
              <q-item-section class="text-primary text-bold">
                POY
              </q-item-section>
              <q-item-section class="text-weight-bold" side>
                {{ formattedPOY }}
              </q-item-section>
            </q-item>
            <q-item class="q-py-xs">
              <q-item-section class="text-primary text-bold">
                DGW
              </q-item-section>
              <q-item-section class="text-weight-bold" side>
                {{ formattedDGW }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card class="hero-section__headline transparent text-white">
        <q-item>
          <q-item-section>
            <q-item-label class="hero-section__headline--title text-h2 text-center">Donkey's Gone Wild</q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section horizontal>
          <q-card-section class="hero-section__headline--message q-pa-none" v-html="lastHeroHeadline">
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { stripHTML } from 'src/functions/functions-common'

export default {
  data () {
    return {

    }
  },
  props: ['bank'],
  computed: {
    ...mapGetters('leagueSettings', ['userInfo']),
    ...mapGetters('announcements', ['announcementsLoaded', 'lastHeroHeadline']),
    formattedFinalTable: function () {
      return this.formatValue(this.bank.finalTable)
    },
    formattedPOY: function () {
      return this.formatValue(this.bank.playerOfTheYear)
    },
    formattedDGW: function () {
      return this.formatValue(this.bank.DGW)
    },
    hero_message: function () {
      return stripHTML(this.lastHeroHeadline)
    }
  },
  methods: {
    formatValue (amount) {
      const options2 = { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }
      const numberFormat2 = new Intl.NumberFormat('en-US', options2)

      return numberFormat2.format(amount)
    }
  }
}
</script>

<style lang="scss">
  .hero-section {
    position: relative;
    min-height: 33rem;
    width: 100%;
    overflow: hidden;
    background-image: url(cards_in_the_air.png);
    background-size: cover;
    /* grid styles */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    align-items: center;
    grid-gap: 3rem;

      &__headline {
        justify-self: center;
        max-height: 28rem;
        min-width: 280px;
        max-width: 500px;
        margin-left: 4rem;
      }

      &__pool {
        overflow: auto;
        justify-self: center;
        min-width: 220px;
        max-width: 250px;
        background-color: $off-white;
        // margin-top: 60px;

      }

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color: rgba(0,0,0,0.7);
      // background-color: rgba(152, 66, 211, 0.63);
    }
  }

.hero-section__headline--message {
  overflow: scroll;
  justify-self: center;
  max-height: 23rem;

}

  .q-page {
    min-height: auto;
  }

  @media screen and (max-width: 799px) {
    .hero-section {
      &__headline {
        margin-left: 1rem;

        &--title {
          font-size: 2.5rem;
        }
      }
    }
  }

  @media screen and (max-width: 799px) {
    .hero-section {
      grid-gap: 1rem;
      &__parent {

        &--pool {
          margin: 4px auto 4px auto;
          padding: 4px auto 4px auto;
        }
        &--hero-card {
          margin: 4px auto 4px auto;
          padding: 4px auto 4px auto;
        }
      }
    }
  }
</style>
