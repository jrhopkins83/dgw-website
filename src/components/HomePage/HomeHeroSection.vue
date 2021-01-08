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
          </q-list>
        </q-card-section>
      </q-card>
      <div class="hero-section__headline transparent text-white">
        <q-item>
          <q-item-section>
            <q-item-label class="hero-section__headline--title text-h2 text-center">Donkey's Gone Wild</q-item-label>
          </q-item-section>
        </q-item>
        <div>
          <div class="hero-section__headline--message q-pa-none scroll" v-html="lastHeroHeadline">
          </div>
        </div>
      </div>
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
    grid-template-columns: 2fr 3fr;
    align-items: center;
    grid-gap: 3rem;

      &__headline {
        position: relative;
        align-self: flex-start;
        justify-self: flex-start;
        max-height: 28rem;
        min-width: 280px;
        max-width: 650px;
        margin-left: 4rem;
      }

      &__pool {
        overflow: auto;
        align-self: center;
        justify-self: flex-end;
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
      grid-template-columns: 1fr;
      grid-template-rows: 2fr 1fr;
      grid-gap: 1rem;

      &__headline {
        grid-row-start: 1;
        align-self: flex-start;
        justify-self: center;
        max-height: 36rem;
        margin: 4px 1rem 4px 1rem;
        padding: 4px auto 4px auto;

        &--message {
          max-height: 34rem;
        }
      }

      &__pool {
        grid-row-start: 2;
        overflow: auto;
        align-self: flex-start;
        justify-self: flex-end;
        margin: 4px auto 4px auto;
        padding: 4px auto 4px auto;

      }
    }
  }

</style>
