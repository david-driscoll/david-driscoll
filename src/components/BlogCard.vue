<template>
  <v-card class="mx-auto" max-width="800px">
    <v-img
      contain
      :src="series.image.path"
      min-height="200px"
      class="align-end secondary--text"
    >
      <div
        class="license rounded-bl-xl"
        :class="{ white: !$vuetify.theme.dark, black: $vuetify.theme.dark }"
      >
        <license v-if="series.image.license" :license="series.image.license" />
      </div>
      <g-link :to="series.path">
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
      </g-link>
    </v-img>

    <v-card-subtitle> {{ series.description }} </v-card-subtitle>
    <v-card-text>
      <v-timeline dense>
        <v-timeline-item
          v-for="(post, i) in posts.slice(0, visiblePosts)"
          :key="post.id"
          :color="post.isFuture ? 'grey' : ''"
          small
        >
          <template v-slot:icon>
            <span class="font-weight-bold">{{ i + 1 }}</span>
          </template>
          <v-card
            :to="!post.isFuture ? post.path : ''"
            :color="'deep-purple'"
            :class="{
              'white--text': true,
              'rounded-a-xl': true,
              'deep-purple': true,
              'darken-4': false,
              'accent-2': false,
            }"
          >
            <v-card-title> {{ post.title }} </v-card-title>
            <v-card-subtitle
              :class="{
                'white--text': true,
              }"
            >
              <sup>{{ toDisplayDate(post.date) }}</sup>
              <span v-if="post.description"><br />{{ post.description }}</span>
            </v-card-subtitle>
          </v-card>
        </v-timeline-item>

        <v-card-actions>
          <div
            class="flex-grow-1 transparent"
            style="margin-top: -4em; margin-left: 1.6em"
          >
            <v-btn icon @click="show = !show" color="white" class="primary">
              <fa-icon :icon="show ? $icons.chevronUp : $icons.chevronDown" />
            </v-btn>
          </div>
          <v-spacer />
        </v-card-actions>
        <v-expand-transition>
          <div v-show="show">
            <v-timeline-item
              v-for="(post, i) in posts.slice(visiblePosts)"
              :key="post.id"
              :color="post.isFuture ? 'grey' : ''"
              small
            >
              <template v-slot:icon>
                <span class="font-weight-bold">{{ i + 1 + visiblePosts }}</span>
              </template>
              <v-card
                :color="'deep-purple'"
                :to="!post.isFuture ? post.path : ''"
                :class="{
                  'white--text': true,
                  'rounded-a-xl': true,
                  'deep-purple': true,
                  'darken-4': false,
                  'accent-2': false,
                }"
              >
                <v-card-title> {{ post.title }} </v-card-title>
                <v-card-subtitle
                  :class="{
                    'white--text': true,
                  }"
                >
                  <sup>{{ toDisplayDate(post.date) }}</sup>
                  <span v-if="post.description"
                    ><br />{{ post.description }}</span
                  >
                </v-card-subtitle>
              </v-card>
            </v-timeline-item>
          </div>
        </v-expand-transition>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import License from "./License.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
import { DateTime } from "luxon";
import { useImage } from "../defaultImage";
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
        {
          id: string;
          path: string;
          title: string;
          description: string;
          date: string;
        }[]
      >,
      required: true,
    },
  },
  components: { License },
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