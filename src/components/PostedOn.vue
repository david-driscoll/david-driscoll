<template>
  <div
    class="posted-on d-inline-flex flex-column flex-grow-0 flex-shrink-0"
    :style="{ transform: 'scale(' + scale + ')' }"
    style="height: 8em; width: 8em; overflow: hidden"
  >
    <v-sheet
      class="top justify-center align-center d-flex font-weight-bold"
      :class="textColor"
      color="primary"
    >
      <div class="month mr-2" v-text="month"></div>
      <div class="year" v-text="year"></div>
    </v-sheet>
    <v-sheet
      class="bottom justify-space-around flex-column align-center d-flex font-weight-bold"
      :class="textColor"
      color="accent"
    >
      <!-- <fa-icon :icon="$icons.faCalendar" size="10x" /> -->
      <div class="dayOfWeek flex-grow-0 mt-2" v-text="dayOfWeek"></div>
      <div class="day flex-grow-1 mt-2" v-text="day"></div>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { DateTime, FixedOffsetZone } from "luxon";
import { defineComponent, ref, computed, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    date: [Date, String] as PropType<Date | string>,
    scale: {
      type: Number as PropType<number>,
      default: 1,
    },
  },
  setup(props, context) {
    const value = computed(() => {
      if (typeof props.date === "string") {
        return DateTime.fromISO(props.date ?? new Date(), { zone: FixedOffsetZone.utcInstance });
      }
      return DateTime.fromJSDate(props.date ?? new Date(), { zone: FixedOffsetZone.utcInstance });
    });
    return {
      dayOfWeek: computed(() => value.value.toFormat("ccc")),
      year: computed(() => value.value.toFormat("yyyy")),
      day: computed(() => value.value.day),
      month: computed(() => value.value.toFormat("MMM")),
    };
  },
  computed: {
    textColor() {
      if (this.$vuetify.theme.dark) {
        return {
          "is-dark": true,
        };
      }
      return {
        "is-light": true,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.posted-on {
  text-transform: uppercase;
  line-height: 1;
}
.is-dark {
  color: rgba(0, 0, 0, 0.4);
}
.is-light {
  color: rgba(255, 255, 255, 0.6);
}
.top {
  height: 28%;
}
.bottom {
  height: 72%;
}
.dayOfWeek {
  font-size: 1.25em;
  font-weight: 900;
}
.day {
  font-size: 3.5em;
  font-weight: 900;
}
.month {
  font-size: 0.9em;
  font-weight: 900;
}
.year {
  font-size: 0.9em;
  font-weight: 900;
}
</style>