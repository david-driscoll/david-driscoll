<template>
  <v-app>
    <v-app-bar app color="white" clipped-left dense>
      <v-app-bar-nav-icon
        class="menu-icon"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-tabs centered>
        <v-tab to="/">Home</v-tab>
        <v-tab to="/about/">About</v-tab>
      </v-tabs>
      <v-responsive max-width="260" min-width="260" class="search align-center">
        <v-text-field
          dense
          flat
          hide-details
          rounded
          solo-inverted
        ></v-text-field>
      </v-responsive>
    </v-app-bar>
    <v-navigation-drawer
      app
      :class="{ 'rounded-lg': !$vuetify.breakpoint.mobile }"
      :style="{ 'margin-top': !$vuetify.breakpoint.mobile ? '24px' : '' }"
      v-model="drawer"
      clipped
    >
      <v-sheet rounded="lg">
        <v-list color="transparent" class="pa-0">
          <v-list-item v-for="n in 5" :key="n" link>
            <v-list-item-content>
              <v-list-item-title> List Item {{ n }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item link color="grey lighten-4">
            <v-list-item-content>
              <v-list-item-title> Refresh </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-navigation-drawer>

    <v-main class="grey lighten-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script>
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {
      drawer: ref(),
    };
  },
  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: "description",
          name: "description",
          content: this.$static.metadata.siteDescription,
        },
      ],
    };
  },
});
</script>

<style scoped>
.menu-icon {
  position: absolute;
  left: 2em;
  bottom: 0;
  top: 0;
  z-index: 1000;
}
.search {
  position: absolute;
  right: 2em;
  bottom: 0;
  top: 0;
  z-index: 1000;
}
</style>
