<template>
  <v-container>
    <v-card min-height="80vh" rounded="lg">
      <v-img
        :src="$page.post.image.path"
        aspect-ratio="16/4"
        height="400"
        class="pa-2 align-end"
      >
        <v-card-title>
          <h1 v-html="$page.post.title" />
        </v-card-title>
      </v-img>
      <v-card-subtitle v-text="$page.post.description" />
      <v-card-text v-html="$page.post.content" />
    </v-card>
  </v-container>
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
    description
    image { path }
  }
}
</page-query>