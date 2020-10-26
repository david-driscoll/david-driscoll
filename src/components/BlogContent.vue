<template>
  <bg-image :image="post.image.path" :license="post.image.license" position="top top" size="contain" class="pa-2">
    <v-container v-if="post.title || post.description" style="min-height: 15vw" class="d-flex justify-center align-center flex-column white--text">
      <g-link :to="post.path" class="white--text" v-if="linkTo">
        <h1 v-html="post.title" />
      </g-link>
      <h1 v-html="post.title" v-else />
      <h3 class="text-body-1" v-html="post.description" v-if="post.description" />
    </v-container>

    <v-container :fluid="fluid">
      <v-sheet rounded="lg">
        <v-card :min-height="minHeight" rounded="lg" class="d-flex align-top flex-column justify-space-between">
          <v-card-text class="block pa-0">
            <posted-on :date="post.date" class="float-right rounded-tr rounded-bl-xl rounded-tl-0 ml-2" />
            <div v-html="post.content" class="pa-4 content text-body-1" />
          </v-card-text>
          <card-tags class="accent" color="primary" v-if="post.tags && post.tags.length > 0" :tags="post.tags" />
        </v-card>
      </v-sheet>

      <slot />
    </v-container>
  </bg-image>
</template>

<script lang="ts">
import License from "./License.vue";
import Default from "../layouts/Default.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
import { DateTime } from "luxon";
import PostedOn from "./PostedOn.vue";
import CardTags from "./CardTags.vue";
import BgImage from "./BgImage.vue";
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
    minHeight: {
      type: [String, Number] as PropType<number | string | undefined>,
      required: false,
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
        tags: { path: string; title: string }[];
      }>,
      required: true,
    },
  },
  components: { License, PostedOn, Default, BgImage, CardTags },
  setup(props, context) {
    return {
      show: ref(false),
      visiblePosts: 2,
    };
  },
});
</script>


<style lang="scss">
.content {
  line-height: 2rem;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 3rem;
    &:first-child {
      margin-top: -1rem !important;
    }
  }
}
.license {
  top: 0;
  right: 0;
  .theme--dark & {
    background-color: black;
  }
  .theme--light & {
    background-color: white;
  }
}
</style>