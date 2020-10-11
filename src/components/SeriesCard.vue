<template>
  <v-card class="mx-auto" max-width="800px">
    <v-img
      :src="series.image.path"
      min-height="200px"
      max-height="340px"
      class="align-end secondary--text"
    >
      <span class="license">
        <license
          v-if="series.image.license"
          :license="series.image.license"
        ></license>
      </span>
      <v-card-title
        :class="{
          'white--text': true,
          'rounded-tr-xl': true,
          'deep-purple': true,
          'darken-4': false,
          'accent-2': false,
        }"
        style="width: fit-content"
      >
        {{ series.title }}
      </v-card-title>
    </v-img>

    <v-card-subtitle> {{ series.description }} </v-card-subtitle>

    <v-card-actions>
      <v-btn color="orange lighten-2" text> Explore </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon @click="show = !show">
        <fa-icon :icon="show ? $icons.chevronUp : $icons.chevronDown"></fa-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          I'm a thing. But, like most politicians, he promised more than he
          could deliver. You won't have time for sleeping, soldier, not with all
          the bed making you'll be doing. Then we'll go with that data file!
          Hey, you add a one and two zeros to that or we walk! You're going to
          do his laundry? I've got to find a way to escape.
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import License from "./License.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    series: {
      type: Object as PropType<{
        id: string;
        path: string;
        title: string;
        description: string;
        image: {
          path: string;
          license?: {
            attribution?: { name?: string; url: string };
            author?: { name?: string; url: string };
            original?: { name?: string; url: string };
          };
        };
      }>,
      required: true,
    },
    posts: {
      type: Array as PropType<
        { id: string; path: string; title: string; date: string }[]
      >,
      required: true,
    },
  },
  components: { License },
  setup(props, context) {
    return {
      show: ref(false),
    };
  },
});
</script>


<style lang="scss" scoped>
.license {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
}
</style>