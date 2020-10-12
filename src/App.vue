<template>
  <v-app>
    <v-app-bar app clipped-left dense>
      <v-app-bar-nav-icon class="menu-icon" @click="drawer = !drawer" />
      <v-tabs
        centered
        optional
        icons-and-text
        :grow="$vuetify.breakpoint.mobile"
      >
        <v-tab to="/" exact :style="tabStyle">
          Home
          <fa-icon
            primary-opacity="0.5"
            secondary-opacity="0.5"
            fixedWidth
            :icon="$icons.faHomeAlt"
          />
        </v-tab>
        <v-tab to="/about/" exact :style="tabStyle">
          About
          <fa-icon fixedWidth :icon="$icons.faUserTag" />
        </v-tab>
      </v-tabs>
      <v-btn icon @click="dark = !dark">
        <fa-icon :icon="dark ? $icons.faMoonStars : $icons.faSun" />
      </v-btn>
      <!--
      <v-responsive max-width="260" min-width="260" class="search align-center">
        <v-text-field dense flat hide-details rounded solo-inverted />
      </v-responsive>
      -->
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
          <v-list-item
            v-for="link in links"
            :key="link.path"
            link
            :to="link.path"
          >
            <v-list-item-content>
              <v-list-item-title
                ><fa-icon fixedWidth :icon="link.icon" />{{ link.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- <v-list-item link>
            <v-list-item-content>
              <v-list-item-title> Refresh </v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
      </v-sheet>
    </v-navigation-drawer>

    <v-main>
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

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from "@vue/composition-api";
import {
  faHomeAlt,
  faUserTag,
  faBook,
  faSun,
  faMoonStars,
} from "@fortawesome/pro-duotone-svg-icons";
export default defineComponent({
  setup() {
    const dark = ref(true);

    onBeforeMount(() => {
      dark.value = (localStorage.getItem("dark") ?? true) === "true";
    });

    watch(dark, (x) => localStorage.setItem("dark", x.toString()));

    return {
      drawer: ref(),
      dark,
      links: [
        {
          icon: faBook,
          title: "Blog Series",
          path: "/series/",
        },
      ],
    };
  },
  icons: {
    faHomeAlt,
    faUserTag,
    faBook,
    faSun,
    faMoonStars,
  },
  computed: {
    tabStyle() {
      if (this.$vuetify.breakpoint.mobile) return {};
      return {
        "min-width": "120px",
      };
    },
  },
  watch: {
    dark: {
      immediate: true,
      handler(v) {
        this.$vuetify.theme.dark = v;
      },
    },
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

<style lang="scss">
:root [class*="--active"] .v-icon {
  --fa-primary-color: inherit !important;
  --fa-primary-opacity: inherit !important;
  --fa-secondary-color: inherit !important;
  --fa-secondary-opacity: inherit !important;
}
.v-icon {
  --fa-primary-opacity: 1;
  --fa-secondary-opacity: 1;
  .theme--light :not([class*="--active"]) & {
    --fa-primary-color: rgb(62, 53, 188);
    --fa-secondary-color: rgb(244, 160, 0);
  }
  .theme--dark :not([class*="--active"]) & {
    --fa-primary-color: rgb(127, 122, 196);
    --fa-secondary-color: rgb(236, 189, 100);
  }
}

/*
.v-pagination__item
 */
</style>

<style scoped>
/* .menu-icon {
  position: absolute;
  left: 2em;
  bottom: 0;
  top: 0;
  z-index: 1000;
} */
.search {
  position: absolute;
  right: 2em;
  bottom: 0;
  top: 0;
  z-index: 1000;
}
</style>
