<template>
  <div>
    <div class="news-section">
      <div class="news-section__content col-12 text-h2 text-bold q-pa-md">
        <div class="news-section__content--title col-10">News / Announcements</div>
        <div class="news-section__content--list">
          <div class="news_item"
            v-for="(item, id) in news_items"
            :key="id"
          >
            <div class="news_item-headline row wrap justify-between items-start content-start">
              <div class="headline--subject">
                <div>
                  <div>{{ item.subject}}</div>
                </div>
              </div>
              <div class="headline-button">
                <div>
                  <q-btn
                    color="white"
                    label="Read more..."
                    flat
                    @click="viewNewsItem"
                  />
                </div>
              </div>
            </div>
            <div class="news--detail">
              <div class="row text-h4 news-date">
                {{ item.date }}
              </div>
              <div class="col-12 text-body1 news-body">
                {{ item.news_text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      news_items: [
        {
          id: '1',
          subject: 'Weekly Update',
          date: '7 October, 2020',
          news_text: 'A quick reminder that tonight is our Sit n Go mini tournaments and tomorrow is our $100 Freeze Out Tournament.  A lot of shuffling in our Top 14 for the Final Table.  A lot of games to go, so plenty of time to move yourself into the Year End Final Table'
        },
        {
          id: '2',
          subject: 'Zoom meetings for Thursday tournaments',
          date: '16 September, 2020',
          news_text: 'I am going to do Zoom again and encourage you to give it a try! Each week it grows and is a ton of fun to share a beer and bust some.....aces.'
        },
        {
          id: '3',
          subject: 'Weekly Update',
          date: '17 September, 2020',
          news_text: 'A quick reminder that Wednesday is our SNG mini tournaments and that Thursday is our $100 Freezeout Tournament.  We had 23 join us last week for the Bounty Tournament.  Congratulations to Pete for bringing down 1st place.  Will was runner up, followed by Mike and Andrew.'
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    viewNewsItem () {
      console.log('News item clicked')
    }
  }
}
</script>

<style lang="scss">
  .news-section {
    position: relative;
    min-height: 20rem;
    max-height: 30rem;
    width: 100%;
    color: $off-white;
    background-image: url(poker_club2.png);
    background-size: cover;
    overflow: scroll;

    &__content {
      position: relative;
      width: 100%;
      margin: 0 auto;
      max-height: 31rem;
      max-width: 72rem;

      &--title {
        text-align: center;

      }

      &--list {
        .news_item {
          position: relative;
          overflow: hidden;
          height: 12rem;
          margin: 1.6rem;
          // padding: .8rem;

          .news_item-headline {
            margin: .8rem;

            .headline--subject {
              font-size: 2rem;
            }

            .headline-button {
              color: $off-white;

              .q-btn {
                text-transform: none;
              }
            }

          }

          .news--detail {
            margin-left: .8rem;
            .news-date {
              margin-bottom: .8rem;
              overflow: auto;
            }

            .news-body {
              position: relative;
              overflow: auto;
              margin: .4rem;
              height: 2.5rem;
              line-height: 2.5rem;
              font-weight: 400;
              overflow:hidden;
            }
          }

          &::before {
            content: "";
            position: absolute;
            background-size: cover;
            border-radius: 1.8rem;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            background-color: rgba(234, 234, 234, 0.4)
          }
        }

      }
    }
    &::before {
      content: "";
      position: absolute;
      background-size: cover;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color: rgba(0,0,0,0.7);
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .news-section {
    background-image: url(poker_club2_short.jpg);
    &__content {
      max-height: 31rem;
      max-width: 60rem;
      padding: 8px 8px;

      &--title {
        font-size: 20px;
      }

      &--list {
        .news_item {
          margin: 4px;
          .news_item-headline {
            margin: .8rem;

            .headline--subject {
              font-size: 1.6rem;
            }

          }
          .news--detail {
            .news-date {
              font-size: 1.6rem;
            }
          }
        }
      }
    }
  }
}
</style>
