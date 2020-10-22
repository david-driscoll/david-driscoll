<template>
  <Layout :image="image" size="contain" position="top" :title="$static.metadata.siteName" :description="$static.metadata.siteDescription" overlay>
    <template v-slot:left>
      <v-col cols="12" md="4" lg="3" xl="2" class="order-2 order-md-1" style="margin-bottom: 10em">
        <blog-card v-for="post in $page.recentPosts.edges" :key="post.node.id" :post="post.node" />
      </v-col>
    </template>
    <template v-slot:right>
      <v-col cols="12" md="3" lg="2" class="order-2 order-md-3" style="margin-top: -10em">
        <tag-cloud :tags="$page.topTags.edges.map((z) => z.node)" style="min-height: 20vw; max-height: 30vw; margin-bottom: 5em" />
      </v-col>
    </template>
    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
    <g-image alt="Example image" src="~/favicon.png" width="135" />

    <h1>Hello, world!</h1>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur excepturi labore tempore expedita, et iste tenetur suscipit explicabo! Dolores, aperiam non officia eos quod asperiores</p>

    <p class="home-links">
      <a href="https://gridsome.org/docs/" target="_blank" rel="noopener">Gridsome Docs</a>
      <a href="https://github.com/gridsome/gridsome" target="_blank" rel="noopener">GitHub</a>

      <v-sheet color="primary" height="40" width="40"></v-sheet>
      <v-sheet color="secondary" height="40" width="40"></v-sheet>
      <v-sheet color="accent" height="40" width="40"></v-sheet>
      <v-sheet color="error" height="40" width="40"></v-sheet>
      <v-sheet color="warning" height="40" width="40"></v-sheet>
      <v-sheet color="info" height="40" width="40"></v-sheet>
      <v-sheet color="success" height="40" width="40"></v-sheet>
      <br />

      <!-- <v-card
        v-for="edge in $page.posts.edges"
        :key="edge.node.id"
        :post="edge.node"
        :to="edge.node.path"
      >
        {{ edge.node.title }}
        {{ edge.node.date }}
      </v-card> -->

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
import BlogCard from "../components/BlogCard.vue";
import TagCloud from "../components/TagCloud.vue";
export default defineComponent({
  components: { BlogCard, Layout, TagCloud },
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
    return this.$seo({ }, { title: 'Home' });
  },
});
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>

<page-query>
query {
  recentPosts: allBlogPost(
    limit: 3
    sort: { by: "date", order: DESC }
    filter: { isFuture: { eq: false } }
  ) {
    totalCount
    edges {
      node {
        id
        path
        title
        description
        timeToRead
        date
        image {
          path
        }
      }
    }
  }
  #topTags: allTag(limit: 10, sort: { by: "count", order: DESC }) {
  topTags: allTag(sort: { by: "count", order: DESC }) {
    edges {
      node {
        id
        title
        path
        slug
        count
      }
    }
  }
}
</page-query>