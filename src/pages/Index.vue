<template>
  <Layout :image="image" size="contain" position="top" :title="$static.metadata.siteName" :description="$static.metadata.siteDescription" overlay>
    <template v-slot:left>
      <v-col cols="12" lg="3" xl="2" class="order-2 order-lg-1" style="margin-bottom: 10em">
        <blog-card v-for="post in $page.recentPosts.edges" :key="post.node.id" :post="post.node" />
      </v-col>
    </template>
    <template v-slot:right>
      <v-col cols="12" lg="2" class="order-2 order-lg-3" style="margin-top: -10em">
        <tag-cloud :tags="$page.topTags.edges.map((z) => z.node)" style="min-height: 20vw; max-height: 30vw; margin-bottom: 5em" />
      </v-col>
    </template>

    <v-sheet rounded="lg" min-height="30vh" elevation="2" class="pa-3">
      <h1>Hello There!</h1>

      <p>Welcome to my little world!</p>

      <p>I try to write things that are on my mind and document the things I do! <sub></sub></p>

      <p>Feel free to explore my blog, if you're interested in how it's built, the source is <a href="https://github.com/david-driscoll/daviddriscoll.me" target="_blank">here</a></p>
      <p>Social links and other general stuff is at the bottom!</p>
      Enjoy! ╰(*°▽°*)╯
    </v-sheet>
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
    return this.$seo({}, { title: "Home" });
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