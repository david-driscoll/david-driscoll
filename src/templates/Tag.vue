<template>
  <div>{{ $page.tag }}</div>
</template>

<page-query>
query ($id: ID!) {
  tag: tag(id: $id) {
    id
    path
    title
    count
  }
}
</page-query>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
</style>