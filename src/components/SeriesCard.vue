<template>
  <v-card :to="series.path">
    <v-card-title class="primary white--text">
      Series: {{ series.title }}
    </v-card-title>
    <bg-image
      :image="series.image.path"
      :license="series.image.license"
      class="align-end d-flex secondary--text pa-0"
      style="min-height: 80px"
    >
    </bg-image>
  </v-card>
</template>

<script lang="ts">
import BgImage from "./BgImage.vue";
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
  },
  components: { BgImage },
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