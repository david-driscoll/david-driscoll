<template>
  <v-card class="ma-4" :to="post.path">
    <g-image :src="post.image.path" class="title-image" />
    <posted-on
      :date="post.date"
      scale="0.6"
      :style="{
        right: datePosition === 'right' ? 0 : undefined,
        left: datePosition === 'left' ? 0 : undefined,
      }"
      :class="{
        'rounded-tl-lg': datePosition === 'right',
        'rounded-tr-lg': datePosition === 'left',
      }"
    />
    <v-card-title v-html="post.title" />
    <v-card-subtitle
      v-if="post.description"
      v-html="post.description"
    ></v-card-subtitle>
    <v-card-subtitle>
      <span v-if="post.series && post.series.title">
        Series: {{ post.series.title }}
      </span>
      &nbsp;
    </v-card-subtitle>
    <v-card-text>
      <v-container
        v-if="post.title || post.description"
        class="d-flex justify-center align-center flex-column white--text"
      >
      </v-container>
    </v-card-text>
    <card-tags v-if="post.tags.length > 0" :tags="post.tags" class="primary" color="secondary" />
  </v-card>
</template>

<style lang="scss" scoped>
.title-image {
  height: 6em;
  object-fit: cover;
  width: 100%;
  object-position: center;
}
.posted-on {
  position: absolute;
  top: 6em - 4.8em;
}
</style>

<script lang="ts">
import License from "./License.vue";
import Default from "../layouts/Default.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
import { DateTime } from "luxon";
import PostedOn from "./PostedOn.vue";
import CardTags from "./CardTags.vue";
import BgImage from "./BgImage.vue";
import { getImagePath } from "../defaultImage";
export default defineComponent({
  props: {
    datePosition: {
      type: String as PropType<"right" | "left">,
      default: "right",
      required: false,
      validator(value) {
        return value === "right" || value === "left";
      },
    },
    post: {
      type: Object as PropType<{
        id: string;
        path: string;
        title: string;
        description: string;
        content: string;
        series: {
          title: string;
        };
        tags: {
          title: string;
          path: string;
        }[];
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
  components: { License, PostedOn, Default, BgImage, CardTags },
  setup(props: any, context: any) {
    return {
      show: ref(false),
      visiblePosts: 2,
    };
  },
});
</script>
