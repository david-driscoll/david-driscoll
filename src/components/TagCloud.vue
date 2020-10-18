<template>
  <vue-word-cloud
    font-family="Roboto"
    :words="tagTuple"
    :colors="() => 'DeepPink'"
    :rotation="rotation"
  >
    <template slot-scope="{ text, word }">
      <g-link :class="color(word)" style="text-decoration: none;" :to="paths[text]">{{ text }}</g-link>
    </template>
  </vue-word-cloud>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import Vue from "vue";
import { Chance } from "chance";
import VueWordCloud from "vuewordcloud";
import { defineComponent, ref, PropType } from "@vue/composition-api";
import colors from 'vuetify/es5/util/colors'

const rotations = [0, 1 / 8, 3 / 4, 7 / 8];
const colorList = ['primary--text', 'secondary--text', 'info--text', 'accent--text', 'success--text' ];

export default defineComponent({
  components: { VueWordCloud },
  props: {
    tags: {
      type: Array as PropType<{ title: string; path: string; count: number }[]>,
      required: true,
    },
  },
  setup() {
    return {};
  },
  computed: {
    tagTuple(): [string, number][] {
      return this.tags.map((z) => [z.title, z.count]);
    },
    paths(): { [key: string]: string } {
      const a: { [key: string]: string } = {};
      for (const tag of this.tags) {
        a[tag.title] = tag.path;
      }
      return a;
    },
  },
  methods: {
    rotation(word: [string, number]) {
      return new Chance(word[0]).pickone(rotations);
    },
    color(word: [string, number]) {
        const c = new Chance(word[0]);
        const darkLight = c.bool();
       return {
           [c.pickone(colorList)]: true,
           ['text--darken-1']: darkLight && !this.$vuetify.theme.dark,
           ['text--lighten-1']: darkLight && this.$vuetify.theme.dark
       }
    }
  },
});
</script>