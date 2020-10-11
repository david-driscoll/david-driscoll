// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import type { Client } from '@tyankatsu0105/types-gridsome';

import Vuetify from "vuetify/lib";

// import "./assets/index.scss";

import DefaultLayout from "~/layouts/Default.vue";
import VueCompositionAPI from '@vue/composition-api'
import { iconPlugin } from './icons';
import { faArrowsAltV, faBars, faCaretDown, faCheck, faCheckCircle, faInfoSquare, faInfo, faCheckSquare, faChevronDown, faChevronUp, faChevronLeft, faChevronRight, faCircle, fad, faDotCircle, faEdit, faExclamation, faExclamationTriangle, faInfoCircle, faMinus, faMinusSquare, faPaperclip, faPlus, faSortUp, faSquare, faStar, faStarHalf, faStepBackward, faStepForward, faSync, faTimes, faTimesCircle } from "@fortawesome/pro-duotone-svg-icons";
import {
  faKeybase,
  faLinkedin,
  faStackOverflow,
  faPatreon,
  faVimeo,
  faPaypal,
  faGithub,
  faTwitter,
  faTwitch

 } from "@fortawesome/free-brands-svg-icons";

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
  appOptions.vuetify = new Vuetify({
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

        faKeybase,
        faLinkedin,
        faStackOverflow,
        faPatreon,
        faVimeo,
        faPaypal,
        faGithub,
        faTwitter,
        faTwitch
      })
    },

  });

  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
}
