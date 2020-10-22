<template>
  <v-container class="d-flex flex-column">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-center">
            <span>Posts for '{{ $page.tag.title }}'</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(post, i) in posts" :key="post.id" class="pa-0" cols="12" sm="12" md="6" xl="4">
        <blog-card :post="post" :date-position="getDatePosition(i)" />
        <!-- <blog-card
          v-for="post in right"
          :key="post.id"
          :post="post"
          date-position="left"
        /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<page-query>
query ($id: ID!) {
  tag: tag(id: $id) {
    id
    path
    title
    count
  },
  posts: allBlogPost(sort: {  by:"date", order: DESC }, filter: { isFuture: { ne: true }, tags: { id: { eq: $id }  } }) {
    totalCount
    edges {
      node {
        id
        path
        excerpt(length: 200)
        date
        title
        image {
          path
        }
        tags(sort: { by:"title", order: ASC }) {
          title
          path
        }
        series {
          title
        }
      }
    }
  }
}
</page-query>

<script lang="ts">
import BlogCard from "../components/BlogCard.vue";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  components: { BlogCard },
  metaInfo() {
    return this.$seo({ title: `Tag - ${this.$page.tag.title}` }, {});
  },
  setup() {
    return {};
  },
  methods: {
    getDatePosition(index: number) {
      if (this.$vuetify.breakpoint.smAndDown) {
        return "right";
      }
      if (this.$vuetify.breakpoint.xl) {
        return Math.ceil((index + 1) / 3) % 2 === 0 ? "right" : "left";
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        return index % 2 === 0 ? "right" : "left";
      }
    },
  },
  computed: {
    posts() {
      return (this.$page.posts.edges as any[]).map((z) => z.node);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>