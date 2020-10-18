// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import type { Client } from '@tyankatsu0105/types-gridsome';


// import "./assets/index.scss";

import DefaultLayout from "~/layouts/Default.vue";
// import 'vuetify/dist/vuetify.min.css'
import VueCompositionAPI from '@vue/composition-api'
import { iconPlugin } from './icons';
import Vuetify from "vuetify/lib";
import { faArrowsAltV, faBars, faCaretDown, faCheck, faCheckCircle, faInfoSquare, faInfo, faCheckSquare, faChevronDown, faChevronUp, faChevronLeft, faChevronRight, faCircle, fad, faDotCircle, faEdit, faExclamation, faExclamationTriangle, faInfoCircle, faMinus, faMinusSquare, faPaperclip, faPlus, faSortUp, faSquare, faStar, faStarHalf, faStepBackward, faStepForward, faSync, faTimes, faTimesCircle } from "@fortawesome/pro-duotone-svg-icons";

import colors from 'vuetify/es5/util/colors'



/** @type import('@tyankatsu0105/types-gridsome').Client */
export default function (Vue: Parameters<Client>[0], { router, head, isClient, appOptions }: Parameters<Client>[1]) {

  if(!head.link) head.link = [];
  head.link.push({
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
  });

  Vue.use(VueCompositionAPI);
  Vue.use(Vuetify);

  /*

  .theme--light :not([class*="--active"]) & {
    --fa-primary-color: rgb(62, 53, 188);
    --fa-secondary-color: rgb(244, 160, 0);
  }
  .theme--dark :not([class*="--active"]) & {
    --fa-primary-color: rgb(127, 122, 196);
    --fa-secondary-color: rgb(236, 189, 100);
  }
   */


  let dark = false;
  try {
  const isDark = localStorage.getItem("dark");
     dark = isDark
      ? isDark === "true"
      : window?.matchMedia("(prefers-color-scheme: dark)").matches === true;
  } catch (e) {}

  appOptions.vuetify = new Vuetify({
    theme: {
      dark,
      themes: {
        light: {
          primary: rgb(62, 53, 188),
          secondary: colors.blueGrey.darken2,
          accent: rgb(244, 160, 0),
          error: colors.red.darken2,
          warning: colors.orange.darken2,
          info: colors.blue.darken2,
          success: colors.green.darken2,
          anchor: rgb(244, 160, 0)
        },
        dark: {
          primary: rgb(127, 122, 196),
          secondary: colors.blueGrey.lighten2,
          accent: rgb(236, 189, 100),
          error: colors.red.lighten2,
          warning: colors.orange.lighten2,
          info: colors.blue.lighten2,
          success: colors.green.lighten2,
          anchor: rgb(236, 189, 100),
        }
      }
    },
    icons: {
      iconfont: "faSvg",
      values: iconPlugin(Vue, {

        complete: faCheck,
        cancel: faTimesCircle,
        close: faTimes,
        delete: faTimesCircle, // delete (e.g. v-chip close)
        clear: faTimesCircle, // delete (e.g. v-chip close)
        success: faCheckCircle,
        info: faInfoCircle,
        warning: faExclamation,
        error: faExclamationTriangle,
        prev: faChevronLeft,
        next: faChevronRight,
        checkboxOn: faCheckSquare,
        checkboxOff: faSquare, // note far
        checkboxIndeterminate: faMinusSquare,
        delimiter: faCircle, // for carousel
        sort: faSortUp,
        expand: faChevronDown,
        menu: faBars,
        subgroup: faCaretDown,
        dropdown: faCaretDown,
        radioOn: faDotCircle,
        radioOff: faCircle,
        edit: faEdit,
        ratingEmpty: faStar,
        ratingFull: faStar,
        ratingHalf: faStarHalf,
        loading: faSync,
        first: faStepBackward,
        last: faStepForward,
        unfold: faArrowsAltV,
        file: faPaperclip,
        plus: faPlus,
        minus: faMinus,

        faInfoSquare,
        faInfo,
        faCheck,
        faTimesCircle,
         faTimes,
         faCheckCircle,
         faInfoCircle,
         faExclamation,
         faExclamationTriangle,
         faChevronLeft,
         faChevronRight,
         faCheckSquare,
         faSquare, // note far
         faMinusSquare,
         faCircle, // for carousel
         faSortUp,
         faChevronDown,
         faChevronUp,
         faBars,
         faCaretDown,
         faDotCircle,
         faEdit,
         faStar,
         faStarHalf,
         faSync,
         faStepBackward,
         faStepForward,
         faArrowsAltV,
         faPaperclip,
         faPlus,
         faMinus,

      })
    },

  });

}

function rgb(red: number, green: number, blue: number) {

  return `#${pad(red.toString(16)).toUpperCase()}${pad(green.toString(16)).toUpperCase()}${pad(blue.toString(16)).toUpperCase()}`
}
function pad(str: string, pad = 2) {
  while (str.length < pad) {
    str = '0' + str;
  }
  return str;
}