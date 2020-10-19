<template>
  <Layout
    :image="image"
    size="contain"
    position="top"
    :title="$static.metadata.siteName"
    :description="$static.metadata.siteDescription"
    overlay
  >
    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
    <g-image alt="Example image" src="~/favicon.png" width="135" />

    <h1>Hello, world!</h1>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
      excepturi labore tempore expedita, et iste tenetur suscipit explicabo!
      Dolores, aperiam non officia eos quod asperiores
    </p>

    <p class="home-links">
      <a href="https://gridsome.org/docs/" target="_blank" rel="noopener"
        >Gridsome Docs</a
      >
      <a
        href="https://github.com/gridsome/gridsome"
        target="_blank"
        rel="noopener"
        >GitHub</a
      >

      <v-sheet color="primary" height="40" width="40"></v-sheet>
      <v-sheet color="secondary" height="40" width="40"></v-sheet>
      <v-sheet color="accent" height="40" width="40"></v-sheet>
      <v-sheet color="error" height="40" width="40"></v-sheet>
      <v-sheet color="warning" height="40" width="40"></v-sheet>
      <v-sheet color="info" height="40" width="40"></v-sheet>
      <v-sheet color="success" height="40" width="40"></v-sheet>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <v-card
        v-for="edge in $page.posts.edges"
        :key="edge.node.id"
        :post="edge.node"
        :to="edge.node.path"
      >
        {{ edge.node.title }}
        {{ edge.node.date }}
      </v-card>

      <!-- <div v-for="edge in $page.series.edges" :key="edge.node.id" :post="edge.node">
        {{edge.node.title}}
      </div> -->
    </p>
  </Layout>
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Layout from "../layouts/Default.vue";
export default defineComponent({
  components: { Layout },
  setup() {
    // return {
    //   image: getImage("App"),
    // };
  },
  computed: {
    image() {
      return (this.$context as any).image.path;
    },
  },
  metaInfo() {
    return {
      title: "Hello, world!",
    };
  },
});
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>

<page-query>
query ($page: Int) {
  posts: allBlogPost(perPage: 3, page: $page, sort: { by:"date", order: DESC }, filter: { isFuture:{ne: true} }) @paginate {
    totalCount
    pageInfo {
      ...pageInfo
    }
    edges {
      node {
        title
        date (format: "dddd, MMMM D YYYY")
        path
      }
    }
  }
}

fragment pageInfo on PageInfo {
  totalItems
  hasPreviousPage
  hasNextPage
  isFirst
  isLast
  totalPages
  currentPage
}
</page-query>