<template>
  <div class="flex-center column">
    <div class="row hero-section">
      <q-card class="hero-section__headline transparent text-white">
        <q-item>
          <q-item-section>
            <q-item-label class="hero-section__headline--title text-h2 text-center">Donkey's Gone Wild</q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section horizontal>
          <q-card-section class="hero-section__headline--message tq-pa-none">
            {{ hero_message }}
          </q-card-section>
        </q-card-section>
      </q-card>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      hero_message: 'Another great turnout for our Tournament with 22 participating.  Congrats to Scotty Lusk for getting the win and $886.  Ron continues to be strong with his 2nd place showing and $627.  Eddy was 3rd and collected $418 and Paul donked his way into 4th and got a reward of $209.  Our next tournament is the $40 Rebuy and Addon.  Remember, be online at 7 p.m. and get a bonus chip! '
    }
  },
  props: ['bank'],
  computed: {
    ...mapGetters('leagueSettings', ['userInfo']),
    formattedFinalTable: function () {
      return this.formatValue(this.bank.finalTable)
    },
    formattedPOY: function () {
      return this.formatValue(this.bank.playerOfTheYear)
    },
    formattedDGW: function () {
      return this.formatValue(this.bank.DGW)
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
    background-image: url(cards_in_the_air.png);
    background-size: cover;
    /* grid styles */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    align-items: center;
    grid-gap: 3rem;

      &__headline {
        overflow: auto;
        justify-self: center;
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
      background-color: rgba(0,0,0,0.5);
      // background-color: rgba(152, 66, 211, 0.63);
    }
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
