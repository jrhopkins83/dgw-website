<template>
  <div class="row q-my-none">
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <top-nav-bar>
        </top-nav-bar>
      </q-header>

      <q-page-container style="q-pt-none">
        <router-view />
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
export default {
  components: {
    topNavBar: require('components/Shared/TopNavBar.vue').default
  }

}
</script>

<style lang="scss">
  .q-layout {
    max-width: 1920;
  }
</style>
