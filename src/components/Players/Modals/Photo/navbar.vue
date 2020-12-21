<template>
  <div class="navbar">
    <nav
      class="nav"
      @click="click"
    >
      <q-btn
        v-if="data.cropped"
        flat
        color="white"
        icon="undo"
        data-action="restore"
        @click="click('restore')"
      >
        <q-tooltip content-class="bg-accent">
          Undo Crop
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="data.loaded && !data.cropping"
        flat
        color="white"
        icon="delete"
        data-action="remove"
        @click="click('remove')"
      >
        <q-tooltip content-class="bg-accent">
          Remove picture
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="data.cropping"
        flat
        color="white"
        icon="cancel"
        data-action="clear"
        @click="click('clear')"
      >
        <q-tooltip content-class="bg-accent">
          Cancel
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="data.cropping"
        flat
        color="white"
        icon="done"
        data-action="crop"
        @click="click('crop')"
      >
        <q-tooltip content-class="bg-accent">
          OK (Enter)
        </q-tooltip>
      </q-btn>
      <a
        v-if="downloadable && data.loaded"
        class="nav__button nav__button--success"
        title="Download"
        :download="name"
        :href="data.croppedUrl"
      >
      <span><q-icon name="get_app" /></span>
      </a>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      downloadable: typeof document.createElement('a').download !== 'undefined',
      name: 'download.png'
    }
  },

  methods: {
    click (action) {
      if (action) {
        this.$emit('change', action)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  float: right;
}

.nav__button {
  background-color: transparent;
  border-width: 0;
  color: #fff;
  cursor: pointer;
  display: block;
  float: left;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  width: 3rem;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #0074d9;
    color: #fff;
  }
}

.nav--success:hover {
  background-color: #2ecc40;
}

.nav--danger:hover {
  background-color: #ff4136;
}
</style>
