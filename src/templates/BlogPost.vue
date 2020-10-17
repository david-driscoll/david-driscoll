<template>
  <blog-card :post="$page.post" :linkTo="false">
    <v-container class="pa-0">
      <v-row class="d-flex justify-space-around text-center">
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>Series</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>You might like</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>something else...</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </blog-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Layout from "../layouts/Default.vue";
import BlogCard from "../components/BlogCard.vue";
export default defineComponent({
  components: { BlogCard },
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
    id
    title
    date
    path
    content
    description
    image { path }
  }
}
</page-query>