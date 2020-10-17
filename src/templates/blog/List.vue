<template>
  <v-container fluid class="pa-0">
    <!--
      <v-img
        :src="post.node.image.path"
        aspect-ratio="16/4"
        height="400"
        class="pa-2 align-end"
      >
        <v-container>
          <h1 v-html="post.node.title" />
          <h3 v-html="post.node.description" />
        </v-container>
      </v-img>
      <v-container>
        <v-card min-height="60vh" rounded="lg">
          <v-card-subtitle v-text="post.node.description" />
          <v-card-text v-html="post.node.content" />
        </v-card>
      </v-container>
      -->

    <blog-card
      :post="post.node"
      min-height="70vh"
      class="pa-2"
      contain
      position="top"
      v-for="post in $page.posts.edges"
      :key="post.node.id"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import BlogCard from "../../components/BlogCard.vue";
import { faCalendar } from "@fortawesome/pro-duotone-svg-icons";
export default defineComponent({
  components: { BlogCard },
  mounted() {},
  icons: { faCalendar },
  setup() {
    return {};
  },
});
</script>


<!--
--fa-primary-color: rgb(127, 122, 196);
    --fa-secondary-color: rgb(236, 189, 100);
-->

<style lang="scss" scoped>
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
        id
        title
        date
        path
        content
        description
        image { path }
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