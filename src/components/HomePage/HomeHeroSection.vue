<template>
  <div class="flex-center column">
    <div class="row hero-section">
      <div class="hero-section__title text-h2 text-center">Donkey's Gone Wild</div>
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
      <div class="hero-section__message q-pa-none scroll" v-html="lastHeroHeadline">
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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 5rem 1fr;
    grid-template-areas:
      "title title"
      "pool message";
    column-gap: 4rem;
    row-gap: 3rem;

    &__title {
      grid-area: title;
      color: $white;
      position: relative;
      align-self: flex-start;
      justify-self: center;
      max-height: 36rem;
      margin-top: 1rem;
    }

    &__pool {
      grid-area: pool;
      max-width: 250px;
      align-self: flex-start;
      justify-self: flex-end;
      background-color: $off-white;
      margin-right: 2rem;
    }

    &__message {
      position: relative;
      grid-area: message;
      color: $white;
      overflow: auto;
      align-self: flex-start;
      justify-self: flex-start;
      max-height: 34rem;
      max-width: 40rem;
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

  @media screen and (max-width: 62rem) {
    .hero-section {
      overflow: hidden;
      /* grid styles */
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 5rem 14rem 1fr;
      grid-template-areas:
        "title"
        "message"
        "pool";
      grid-gap: 2rem;

      &__title {
        grid-area: title;
        color: $white;
        position: relative;
        align-self: flex-start;
        justify-self: center;
        max-height: 36rem;
        margin-top: 1rem;
      }

      &__pool {
        grid-area: pool;
        max-width: 250px;
        align-self: flex-start;
        justify-self: center;
        background-color: $off-white;
        margin-right: 2rem;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }

      &__message {
        position: relative;
        grid-area: message;
        color: $white;
        overflow: auto;
        align-self: flex-start;
        justify-self: flex-start;
        max-height: 34rem;
        max-width: 40rem;
        margin-left: 1rem;
        margin-right: 1rem;
        margin-bottom: 1rem;
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

  }
</style>
