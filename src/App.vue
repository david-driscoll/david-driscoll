<template>
  <v-app :class="{ 'ssr-loading': isServer }">
    <v-main>
      <router-view />
    </v-main>
    <v-flex v-if="isServer" style="height: 100%; width: 100%" class="d-flex justify-center align-center ssr-loader no-js">
      <v-progress-circular size="400" :width="10" indeterminate>
        <span class="headline">Loading</span>
      </v-progress-circular>
    </v-flex>
    <v-app-bar app clipped-left dense hide-on-scroll scroll-threshold="120">
      <v-progress-linear absolute top :dark="dark" color="accent" :active="loading" indeterminate></v-progress-linear>
      <v-tabs right optional :grow="$vuetify.breakpoint.xs" show-arrows>
        <v-tab to="/" exact :style="tabStyle" class="text-md-h5 text-xs-h6 font-weight-medium text-capitalize">
          <span>David</span>
          <span v-if="$vuetify.breakpoint.smAndUp">&nbsp;Driscoll</span>
        </v-tab>
        <v-spacer />
        <v-btn link elevation="0" @click="dark = !dark" class="rounded-0 v-tab no-js" min-height="100%">
          <fa-icon :icon="dark ? $icons.faMoonStars : $icons.faSun" transform="shrink-2" />

          <span class="ml-2" v-if="$vuetify.breakpoint.mdAndUp && $vuetify.theme.dark">Light</span>
          <span class="ml-2" v-if="$vuetify.breakpoint.mdAndUp && !$vuetify.theme.dark">Dark</span>
        </v-btn>
        <v-tab v-for="tab in tabs" :to="tab.to" :key="tab.to" exact :style="tabStyle" :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }">
          <fa-icon fixedWidth :icon="tab.icon" transform="shrink-4" v-if="tab.icon" />
          <span>{{ tab.title }}</span>
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-footer class="body-2 pa-0">
      <v-container fluid class="pa-0">
        <v-row class="d-flex align-center justify-space-between px-6 py-2">
          <v-flex class="flex-grow-0 flex-shrink-0" :style="footerSideStyle">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" href="/feed.atom" target="_blank" :dark="dark" color="secondary" elevation="3" class="ma-2">
                    <span class="px-2">Atom</span> <fa-icon :icon="$icons.faRss" secondary-color="white" primary-color="white" />
                  </v-btn>
                </template>
                <span>Atom Feed</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" href="/feed.xml" target="_blank" :dark="dark" color="accent" elevation="3" class="ma-2">
                    <fa-icon :icon="$icons.faRss" flip="horizontal" secondary-color="white" primary-color="white" /> <span class="px-2">RSS</span>
                  </v-btn>
                </template>
                <span>RSS Feed</span>
              </v-tooltip>
          </v-flex>
          <v-flex class="order-first order-sm-0 text-center">
            Copyright &copy; David Driscoll 2019 - {{ this.$static.metadata.build.year }}
          </v-flex>
          <v-flex class="flex-grow-0 flex-shrink-0 text-right"  :style="footerSideStyle">
            <a href="https://www.netlify.com">
              <img :src="$vuetify.theme.dark ? 'https://www.netlify.com/img/global/badges/netlify-color-accent.svg' : 'https://www.netlify.com/img/global/badges/netlify-dark.svg'" alt="Deploys by Netlify" />
            </a>
          </v-flex>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-end justify-center">
            <v-tooltip top v-for="s in social" :key="s.url">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" fab :href="s.url" target="_blank" :dark="dark" small :color="(s.blackWhite && ($vuetify.theme.dark ? 'white' : 'black')) || s.buttonColor" class="ma-2">
                  <fa-icon
                    :icon="s.icon"
                    :class="{
                      'white--text': (s.blackWhite && !$vuetify.theme.dark) || !s.blackWhite,
                      'black--text': s.blackWhite && $vuetify.theme.dark,
                    }"
                  />
                </v-btn>
              </template>
              <span v-text="s.username ? `${s.title} (${s.username})` : s.title"></span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" fab href="https://mvp.microsoft.com/en-us/PublicProfile/5001656" target="_blank" :dark="dark" small class="ma-2" style="overflow:hidden">
                <img :src="$vuetify.theme.dark ? '/mvp-white.png' : '/mvp.png'" style="height:90%;width:90%;" />
                </v-btn>
              </template>
              Microsoft MVP
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<static-query>
query {
  # used by seo tool as well
  metadata {
    siteName
    siteDescription
    siteUrl
    author {
      username
      firstName
      lastName
      twitter
    }
    build {
      today
      year
    }
  }
}
</static-query>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, watch, inject, computed, provide } from "@vue/composition-api";

import { faKeybase } from "@fortawesome/free-brands-svg-icons/faKeybase";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faStackOverflow } from "@fortawesome/free-brands-svg-icons/faStackOverflow";
import { faPatreon } from "@fortawesome/free-brands-svg-icons/faPatreon";
import { faVimeo } from "@fortawesome/free-brands-svg-icons/faVimeo";
import { faPaypal } from "@fortawesome/free-brands-svg-icons/faPaypal";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faTwitch } from "@fortawesome/free-brands-svg-icons/faTwitch";

import { faHomeAlt } from "@fortawesome/pro-duotone-svg-icons/faHomeAlt";
import { faUserTag } from "@fortawesome/pro-duotone-svg-icons/faUserTag";
import { faBook } from "@fortawesome/pro-duotone-svg-icons/faBook";
import { faSun } from "@fortawesome/pro-duotone-svg-icons/faSun";
import { faMoonStars } from "@fortawesome/pro-duotone-svg-icons/faMoonStars";
import { faTags } from "@fortawesome/pro-duotone-svg-icons/faTags";
import { faHatWitch } from "@fortawesome/pro-duotone-svg-icons/faHatWitch";
import { faPodium } from "@fortawesome/pro-duotone-svg-icons/faPodium";
import { faInfoCircle } from "@fortawesome/pro-duotone-svg-icons/faInfoCircle";
import { faQuestionCircle } from "@fortawesome/pro-duotone-svg-icons/faQuestionCircle";
import { faBlog } from "@fortawesome/pro-duotone-svg-icons/faBlog";
import { faLayerGroup } from "@fortawesome/pro-duotone-svg-icons/faLayerGroup";
import { faRss } from "@fortawesome/pro-duotone-svg-icons/faRss";

export default defineComponent({
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      if (!to.hash && typeof document !== "undefined") {
        this.loading = true;
      }
      next();
    });

    this.$router.afterEach((to, from) => {
      if (!to.hash && typeof document !== "undefined") {
        this.loading = false;
      }
    });
  },
  setup(props, context) {
    const dark = ref(true);
    const fab = ref(false);
    const loaded = ref(false);
    const loading = ref(false);

    onMounted(() => {
      const isDark = localStorage.getItem("dark");
      loaded.value = true;
      dark.value = isDark ? isDark === "true" : window?.matchMedia("(prefers-color-scheme: dark)").matches === true;
    });

    watch(dark, (x) => localStorage.setItem("dark", x.toString()));

    return {
      loaded,
      loading,
      dark,
      fab,
      tabs: [
        { to: "/about/", title: "About", icon: faUserTag },
        { to: "/blog/", title: "Blog", icon: faBlog },
        // { to: "/projects/", title: "Projects", icon: faHatWitch },
        // { to: "/speaking/", title: "Speaking", icon: faPodium },
        { to: "/tags/", title: "Tags", icon: faTags },
        { to: "/series/", title: "Series", icon: faLayerGroup },
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
    isServer() {
      return process.env.VUE_ENV === "server" || !this.loaded;
    },
    tabStyle() {
      if (this.$vuetify.breakpoint.mobile) return {};
      return {
        "min-width": "120px",
      };
    },
    footerSideStyle() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return {width: '100vw', 'text-align': 'center !important'};
      }
      return {
        width: '20em'
      }
    }
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
    faRss,
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
    return this.$seo(
      {
        openGraph: {
          name: this.$static.metadata.siteName,
        },
      },
      {
        title: this.$static.metadata.siteName,
      }
    );
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
</style>

<style scoped>
.ssr-loader {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
}
.ssr-loader {
  color: rgb(62, 53, 188);
  caret-color: rgb(62, 53, 188);
}
@media (prefers-color-scheme: dark) {
  .ssr-loader {
    color: rgb(127, 122, 196);
    caret-color: rgb(127, 122, 196);
  }
}

.ssr-loader,
.ssr-loading {
  background: white !important;
}
@media (prefers-color-scheme: dark) {
  .ssr-loader,
  .ssr-loading {
    background: #121212 !important;
  }
}
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
