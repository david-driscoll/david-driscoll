<template>
  <v-card class="mx-auto">
    <bg-image
      :image="series.image.path"
      :license="series.image.license"
      :style="{ 'min-height': '280px' }"
      class="align-end d-flex secondary--text pa-0"
    >
      <v-card-title
        :class="{
          'white--text': true,
          'rounded-tr-xl': true,
          primary: true,
          'darken-4': false,
          'accent-2': false,
        }"
        :to="series.path"
        style="width: fit-content"
      >
        {{ series.title }}
      </v-card-title>
    </bg-image>

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
              primary: true,
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
            <card-tags :tags="post.tags" color="primary" class="accent" />
          </v-card>
        </v-timeline-item>

        <v-card-actions>
          <div
            class="flex-grow-1 transparent"
            style="margin-top: -4em; margin-left: 1.6em"
          >
            <v-btn icon @click="show = !show" color="white" class="secondary">
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
                  primary: true,
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
                  <span v-if="post.description">
                    <br />{{ post.description }}
                  </span>
                </v-card-subtitle>
                <card-tags :tags="post.tags" color="primary" class="accent" />
              </v-card>
            </v-timeline-item>
          </div>
        </v-expand-transition>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import BgImage from "./BgImage.vue";
import CardTags from "./CardTags.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
import { DateTime, FixedOffsetZone } from "luxon";
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
          tags: {
            title: string;
            path: string;
          }[];
        }[]
      >,
      required: true,
    },
  },
  components: { BgImage, CardTags },
  methods: {
    toDisplayDate(date: Date | string) {
      const dt = (typeof date === "string"
        ? DateTime.fromISO(date, { zone: FixedOffsetZone.utcInstance })
        : DateTime.fromJSDate(date, { zone: FixedOffsetZone.utcInstance })
      ).toUTC();
      return dt.toLocaleString(DateTime.DATE_HUGE);
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


<style lang="scss">
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