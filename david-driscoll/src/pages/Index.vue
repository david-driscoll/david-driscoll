<template>
  <Layout>
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

      <div v-for="edge in $page.posts.edges" :key="edge.node.id" :post="edge.node">
        {{edge.node.title}}
      </div>

      <div v-for="edge in $page.series.edges" :key="edge.node.id" :post="edge.node">
        {{edge.node.title}}
      </div>
    </p>
  </Layout>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
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
query {
  posts: allBlogPost(filter: { }) {
    edges {
      node {
        id
        title
        date (format: "D. MMMM YYYY")
        path
      }
    }
  }
  series: allSeries(filter: { }) {
    edges {
      node {
        id
        title
        path
      }
    }
  }
}
</page-query>