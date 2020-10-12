<template>
  <v-container fluid class="pa-0">
    <v-img
      :src="$page.post.image.path"
      aspect-ratio="16/4"
      height="400"
      class="pa-2 align-end"
    >
      <v-container>
        <h1 v-html="$page.post.title" />
        <h3 v-html="$page.post.description" />
      </v-container>
    </v-img>
    <v-container>
      <v-card min-height="60vh" rounded="lg">
        <v-card-subtitle v-text="$page.post.description" />
        <v-card-text v-html="$page.post.content" />
      </v-card>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  mounted() {},
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
    description
    image { path }
  }
}
</page-query>