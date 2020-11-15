<template>
  <div class="q-pa-sm">
    <template v-if="eventLoaded">
      <div class='row'>
        <div class='col image-container'>
          <q-card
            class="row top-image"
            style="max-height: 272px"
          >
            <q-img class="image q-pa-none"
              :src="`${picture_src}`"
              spinner-color="primary"
              spinner-size="82px"
              style="max-height=100%;"
            >
              <div class="image-subtitle text-center  full-width">
                <div class="event-header q-mx-sm">
                  <div class="row q-mb-xs">
                    <div class="col-12 text-center text-h6">
                        <div>{{ event.eventName }}</div>
                    </div>
                  </div>
                  <div class="row q-mb-xs">
                    <div class="col-4 text-left text-weight-bolder" style="font-size=14px">
                      <div>Host</div>
                    </div>
                    <div class="col-8 text-left text-weight-bold" style="font-size=14px">
                      <div>{{ event.eventHost }} {{ event.contactPhone }}</div>
                    </div>
                  </div>
                  <div class="row q-mb-xs">
                    <div class="col-4 text-left text-weight-bolder">
                      <div>When</div>
                    </div>
                    <div class="col-8 text-left text-weight-bold">
                      <div>{{ event.startDate }}</div>
                      <div class="condensed">From {{ event.startTime }} to {{ event.endTime }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-left text-weight-bolder">
                        <div>Where</div>
                    </div>
                    <div class="col-8 text-left text-weight-bold q-mb-xs">
                        <div>{{ event.eventLocation}}</div>
                        <div class="condensed">{{ event.eventAddress}}</div>
                        <div>{{ event.eventCity}}, {{ event.eventState }} {{ event.eventZip }}</div>
                    </div>
                  </div>
                  <div class="row q-mb-xs">
                    <div class="col-4 text-left text-weight-bolder condensed">
                        <div>Host Comments</div>
                    </div>
                    <div class="col-8 text-left text-weight-bold condensed">
                      <q-scroll-area style="height: 85px;" >
                        <div>{{ event.hostComments }}</div>
                      </q-scroll-area>
                    </div>
                  </div>
                </div>
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  // mixins: [validationMixin],
  // mixins: [formMixin],
  props: ['event', 'eventTime'],
  components: {

  },
  data () {
    return {
      eventLoaded: true,
      picture_src: 'golf-3683333_640.jpg'
    }
  },
  computed: {

  },
  methods: {

  },
  beforeMount () {

  }
}
</script>

<style scoped>
.image-container {
  width: 700px;
  height: 450px;
}
.image {
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%
}
.event-header {
  line-height: 1.25rem;
  font-size: 14px;
}
.condensed {
  line-height: 1rem;
}
.input-field {
  font-size: 1rem;
  line-height: 1rem;
}
.row-header {
  text-align: right;
  font-weight: bold;
  width: 75px;
}
.row-value {
  text-align: left;
  width: 75px;
}
</style>
