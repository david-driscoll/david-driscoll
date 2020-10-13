<template>
  <Layout
    :image="image"
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
      <br />

      <v-card
        v-for="edge in $page.posts.edges"
        :key="edge.node.id"
        :post="edge.node"
        :to="edge.node.path"
      >
        {{ edge.node.title }}
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

<script>
import { defineComponent } from "@vue/composition-api";
import { getImage } from "../defaultImage";
export default defineComponent({
  setup() {
    return {
      image: getImage("App"),
    };
  },
  metaInfo: {
    title: "Hello, world!",
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
  posts: allBlogPost(perPage: 5, page: $page, sort: { by:"date", order: DESC }, filter: { isFuture:{ne: true} }) @paginate {
    edges {
      node {
        id
        title
        date (format: "dddd, MMMM D YYYY")
        path
      }
    }
  }
}
</page-query>