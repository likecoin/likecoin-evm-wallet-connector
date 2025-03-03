<template>
  <v-app light>
    <v-app-bar app>
      <v-toolbar-title>LikeCoin EVM Wallet Connector Demo</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fill-height>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>
