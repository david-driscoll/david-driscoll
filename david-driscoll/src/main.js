// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import Vuetify from "vuetify/lib";
// import "./assets/index.scss";

import DefaultLayout from "~/layouts/Default.vue";

/** @type import('@tyankatsu0105/types-gridsome').Client */
export default function(Vue, { router, head, isClient, appOptions }) {
  head.link.push({
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
  });
  head.link.push({
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
  });

  const opts = {
    icons: {
      iconfont: "mdi",
    },
  }; // opts includes, vuetify themes, icons, etc.
  Vue.use(Vuetify);
  appOptions.vuetify = new Vuetify(opts);

  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
}
