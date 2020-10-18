<template>
  <v-card-actions class="d-flex justify-center">
    <v-chip
      v-for="tag of tags"
      :key="tag.path"
      label
      class="mx-2"
      :to="tag.path"
      v-text="tag.title"
      small
      :color="color"
    />
  </v-card-actions>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    tags: Array as PropType<{ title: string; path: string }[]>,
    color: {
      type: String as PropType<string>,
      default: "accent",
    },
  },
  setup() {
    return {};
  },
});
</script>