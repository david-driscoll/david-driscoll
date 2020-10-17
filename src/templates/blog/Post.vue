<template>
  <blog-card :post="post" :linkTo="false" min-height="40vh">
    <v-container class="pa-0">
      <v-row class="d-flex justify-space-around">
        <v-col>
          <g-link v-if="$page.prev" :to="$page.prev.path">
<v-btn link elevation="0"><fa-icon :icon="$vuetify.icons.$prev"/></v-btn>
          </g-link>
          </v-col>
        <v-col>
          <g-link v-if="$page.next" :to="$page.next.path">
            <v-btn link elevation="0"><fa-icon :icon="$vuetify.icons.$next"/></v-btn>

          </g-link>
          </v-col>
      </v-row>
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
import Layout from "../../layouts/Default.vue";
import BlogCard from "../../components/BlogCard.vue";
export default defineComponent({
  components: { BlogCard },
  mounted() {},
  computed: {
    post() {
      return this.$page.post;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>

<page-query>
query ($id: ID!, $next: ID, $prev: ID) {
  post: blogPost(id: $id) {
    id
    title
    date
    path
    content
    description
    image { path }
  }
  next: blogPost(id: $next) {
    id
    title
    date
    path
  }
  prev: blogPost(id: $prev) {
    id
    title
    date
    path
  }
}
</page-query>