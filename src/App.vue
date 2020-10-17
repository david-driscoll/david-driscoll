<template>
  <v-app>
    <v-app-bar app clipped-left dense hide-on-scroll>
      <v-spacer />
      <v-tabs right optional :grow="$vuetify.breakpoint.xs" show-arrows>
        <v-tab
          to="/"
          g-link
          exact
          :style="tabStyle"
          class="text-md-h5 text-xs-h6 font-weight-medium text-capitalize"
        >
          <!-- <fa-icon class="mx-2" fixedWidth :icon="$icons.faHomeAlt" /> -->
          <span>David</span>
          <span v-if="$vuetify.breakpoint.smAndUp">&nbsp;Driscoll</span>
        </v-tab>
        <v-spacer />
        <v-btn icon @click="dark = !dark">
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
      <!-- <template v-slot:extension v-if="$vuetify.breakpoint.mobile">
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
      </template> -->
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer class="body-2">
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex justify-space-around">
            Copyright &copy; David Driscoll 2019 -
            {{ this.$static.metadata.build.year }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-space-around">
            <v-tooltip top v-for="s in social" :key="s.url">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  fab
                  :href="s.url"
                  target="_blank"
                  :dark="dark"
                  small
                  :color="
                    (s.blackWhite &&
                      ($vuetify.theme.dark ? 'white' : 'black')) ||
                    s.buttonColor
                  "
                >
                  <fa-icon
                    :icon="s.icon"
                    :class="{
                      'white--text':
                        (s.blackWhite && !$vuetify.theme.dark) || !s.blackWhite,
                      'black--text': s.blackWhite && $vuetify.theme.dark,
                    }"
                  />
                </v-btn>
              </template>
              <span
                v-text="s.username ? `${s.title} (${s.username})` : s.title"
              ></span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
    build {
      year
    }
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
  computed,
  provide,
} from "@vue/composition-api";
import {
  faKeybase,
  faLinkedin,
  faStackOverflow,
  faPatreon,
  faVimeo,
  faPaypal,
  faGithub,
  faTwitter,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import {
  faHomeAlt,
  faUserTag,
  faBook,
  faSun,
  faMoonStars,
  faTags,
  faHatWitch,
  faPodium,
  faExternalLinkAlt,
  faInfoCircle,
  faQuestionCircle,
  faBlog,
} from "@fortawesome/pro-duotone-svg-icons";
import { getImage } from "./defaultImage";
const image = getImage("App");
export default defineComponent({
  setup(props, context) {
    const dark = ref(true);
    const fab = ref(false);

    onMounted(() => {
      const isDark = localStorage.getItem("dark");
      dark.value = isDark
        ? isDark === "true"
        : window?.matchMedia("(prefers-color-scheme: dark)").matches === true;
    });

    watch(dark, (x) => localStorage.setItem("dark", x.toString()));

    return {
      dark,
      fab,
      tabs: [
        { to: "/about/", title: "About", icon: faUserTag },
        { to: "/blog/", title: "Blog", icon: faBlog },
        { to: "/projects/", title: "Projects", icon: faHatWitch },
        { to: "/speaking/", title: "Speaking", icon: faPodium },
        { to: "/tags/", title: "Tags", icon: faTags },
      ],
      links: [
        {
          icon: faBook,
          title: "Blog Series",
          path: "/series/",
        },
      ],
      social: [
        {
          icon: faGithub,
          blackWhite: true,
          title: "GitHub",
          username: "david-driscoll",
          url: "https://github.com/david-driscoll",
        },
        {
          icon: faTwitter,
          title: "Twitter",
          username: "@david_dotnet",
          url: "https://www.twitter.com/david_dotnet",
          buttonColor: "#55acee",
        },
        {
          icon: faLinkedin,
          title: "Linkedin",
          username: "",
          url: "https://www.linkedin.com/in/david-driscoll-285b7a34/",
          buttonColor: "#0e76a8",
        },
        {
          icon: faStackOverflow,
          title: "StackOverflow",
          username: "",
          url: "https://stackoverflow.com/users/400771/david-driscoll",
          buttonColor: "#FF9900",
        },
        {
          icon: faKeybase,
          title: "Keybase",
          username: "daviddriscoll",
          url: "https://keybase.io/daviddriscoll",
          buttonColor: "#FF6F21",
        },
        // {
        //   icon: faTwitch,
        //   title: "Twitch",
        //   username: "ddriscoll",
        //   url: "https://www.twitch.tv/ddriscoll",
        //   buttonColor: "#6441A4",
        // },
      ],
    };
  },
  computed: {
    tabStyle() {
      if (this.$vuetify.breakpoint.mobile) return {};
      return {
        "min-width": "120px",
      };
    },
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
    faKeybase,
    faLinkedin,
    faStackOverflow,
    faPatreon,
    faVimeo,
    faPaypal,
    faGithub,
    faTwitter,
    faTwitch,
    faQuestionCircle,
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
