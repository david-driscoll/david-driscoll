<template>
  <div>
    <h1 v-html="$page.post.title" />
    <div v-html="$page.post.content" />
  </div>
</template>

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

<page-query>
query ($id: ID!) {
  post: blogPost(id: $id) {
    title
    content
  }
}
</page-query>