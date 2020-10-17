<template>
  <v-img :src="post.image.path" class="pa-2" contain position="top">
    <div
      class="license rounded-bl-xl"
      :class="{ white: !$vuetify.theme.dark, black: $vuetify.theme.dark }"
    >
      <license v-if="post.image.license" :license="post.image.license" />
    </div>

    <v-container
      v-if="post.title || post.description"
      style="height: 15vw"
      class="d-flex justify-center align-center flex-column white--text"
    >
      <g-link :to="post.path" class="white--text" v-if="linkTo">
        <h1 v-html="post.title" />
      </g-link>
      <h1 v-html="post.title" v-else />
      <h3
        class="text-body-1"
        v-html="post.description"
        v-if="post.description"
      />
    </v-container>

    <v-container :fluid="fluid">
      <v-sheet rounded="lg">
        <v-card min-height="60vh" rounded="lg" class="block">
          <posted-on
            :date="post.date"
            class="float-right rounded-tr rounded-bl-xl rounded-tl-0"
          />
          <v-card-text v-html="post.content" />
        </v-card>
      </v-sheet>

      <slot />
    </v-container>
  </v-img>
</template>

<script lang="ts">
import License from "./License.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
import { DateTime } from "luxon";
import PostedOn from "./PostedOn.vue";
import { getImage } from "../defaultImage";
export default defineComponent({
  props: {
    linkTo: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    fluid: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    post: {
      type: Object as PropType<{
        id: string;
        path: string;
        title: string;
        description: string;
        content: string;
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
  },
  components: { License, PostedOn },
  methods: {
    toDisplayDate(date: Date | string) {
      const dt =
        typeof date === "string"
          ? DateTime.fromISO(date)
          : DateTime.fromJSDate(date);
      return dt.toUTC().toLocaleString(DateTime.DATE_HUGE);
    },
  },
  setup(props, context) {
    return {
      show: ref(false),
      visiblePosts: 2,
    };
  },
});
</script>


<style lang="scss" scoped>
.license {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25em 0.25em 0.5em 0.5em;
}
</style>