<template>
  <v-app id="inspire">
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
    <v-navigation-drawer app class="rounded-lg" v-model="drawer" clipped>
      <v-sheet rounded="lg">
        <v-list color="transparent">
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
      <v-container>
        <v-row>
          <v-col class="flex-shrink-0 flex-grow-1">
            <v-sheet min-height="80vh" rounded="lg">
              <slot />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {
      drawer: ref(true),
    };
  },
});
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style scoped>
body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
}

.v-navigation-drawer {
  margin-top: 24px;
}
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