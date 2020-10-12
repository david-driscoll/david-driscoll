<template>
  <v-app>
    <v-app-bar app clipped-left dense>
      <v-spacer />
      <v-tabs right optional :grow="$vuetify.breakpoint.xs" show-arrows>
        <v-tab
          to="/"
          exact
          :style="tabStyle"
          class="text-md-h5 text-xs-h6 font-weight-medium text-capitalize"
        >
          <!-- <fa-icon class="mx-2" fixedWidth :icon="$icons.faHomeAlt" /> -->
          <span>David</span>
          <span v-if="$vuetify.breakpoint.smAndUp">&nbsp;Driscoll</span>
        </v-tab>
        <v-spacer />
        <v-btn
          v-if="!$vuetify.breakpoint.mobile"
          icon
          :fab="$vuetify.breakpoint.mobile"
          @click="dark = !dark"
        >
          <fa-icon :icon="dark ? $icons.faMoonStars : $icons.faSun" size="xs" />
        </v-btn>
        <v-tab
          v-for="tab in tabs"
          :to="tab.to"
          :key="tab.to"
          exact
          :style="tabStyle"
          :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }"
        >
          <fa-icon
            fixedWidth
            :icon="tab.icon"
            transform="shrink-4"
            v-if="tab.icon"
          />
          <span>{{ tab.title }}</span>
        </v-tab>
      </v-tabs>
      <template v-slot:extension v-if="$vuetify.breakpoint.mobile">
        <v-fab-transition>
          <v-btn
            fab
            absolute
            bottom
            right
            @click="dark = !dark"
            color="secondary"
          >
            <fa-icon
              :icon="dark ? $icons.faMoonStars : $icons.faSun"
              size="xs"
            />
          </v-btn>
        </v-fab-transition>
      </template>
      <!--
      <v-responsive max-width="260" min-width="260" class="search align-center">
        <v-text-field dense flat hide-details rounded solo-inverted />
      </v-responsive>
      -->
    </v-app-bar>
    <!-- <v-navigation-drawer
      app
      :class="{ 'rounded-lg': !$vuetify.breakpoint.mobile }"
      :style="{ 'margin-top': !$vuetify.breakpoint.mobile ? '24px' : '' }"
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
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-navigation-drawer> -->

    <!-- <v-img :src="bgImage" height="20vh"> </v-img> -->
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
  inject,
  provide,
} from "@vue/composition-api";
import {
  faHomeAlt,
  faUserTag,
  faBook,
  faSun,
  faMoonStars,
  faTags,
  faHatWitch,
  faPodium,
} from "@fortawesome/pro-duotone-svg-icons";
import { getImage } from "./defaultImage";
const image = getImage("App");
export default defineComponent({
  setup() {
    const dark = ref(true);
    const img = ref(image);
    provide("bgImage", img);

    onBeforeMount(() => {
      dark.value = (localStorage.getItem("dark") ?? true) === "true";
    });

    watch(dark, (x) => localStorage.setItem("dark", x.toString()));
    watch(img, (x) => (img.value = x || image));

    return {
      dark,
      bgImage: img,
      tabs: [
        { to: "/about/", title: "About", icon: faUserTag },
        { to: "/tags/", title: "Tags", icon: faTags },
        { to: "/projects/", title: "Projects", icon: faHatWitch },
        { to: "/speaking/", title: "Speaking", icon: faPodium },
      ],
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
    faTags,
    faHatWitch,
    faPodium,
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
