<template>
  <v-container fluid class="pa-0">
    <blog-content
      :post="post.node"
      min-height="70vh"
      class="pa-2"
      contain
      position="top"
      v-for="post in $page.posts.edges"
      :key="post.node.id"
    />
    <v-container>
      <v-row class="d-flex justify-space-between">
        <v-col class="flex-grow-0 flex-shrink-0">
          <g-link v-if="prev" :to="prev">
            <v-btn link elevation="0">
              <fa-icon :icon="$icons.prev" class="ma-2" />
              Older
            </v-btn>
          </g-link>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-0">
          <g-link v-if="next" :to="next">
            <v-btn link elevation="0">
              Newer
              <fa-icon :icon="$icons.next" class="ma-2" />
            </v-btn>
          </g-link>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import BlogContent from "../../components/BlogContent.vue";
import { faCalendar } from "@fortawesome/pro-duotone-svg-icons/faCalendar";
export default defineComponent({
  components: { BlogContent },
  mounted() {},
  icons: { faCalendar },
  computed: {
    next() {
      if (!this.$page.posts.pageInfo.hasNextPage) return undefined;
      const page = this.$route?.params?.page;
      const next = this.$page.posts.pageInfo.currentPage + 1;
      const fullPath = this.$route.fullPath;
      return page
        ? fullPath.substring(0, fullPath.lastIndexOf(page.toString())) +
            next.toString() +
            "/"
        : fullPath + "2/";
    },
    prev() {
      if (!this.$page.posts.pageInfo.hasPreviousPage) return undefined;
      const page = this.$route?.params?.page;
      const prev = this.$page.posts.pageInfo.currentPage - 1;
      const fullPath = this.$route.fullPath;
      return (
        fullPath.substring(0, fullPath.lastIndexOf(page)) +
        (prev === 1 ? "" : prev.toString() + "/")
      );
    },
  },
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
        series
        {
          id
          path
          title
          description
        }
        tags
        {
          title
          path
          count
        }
      }
    }
  }
}

fragment pageInfo on PageInfo {
  hasPreviousPage
  hasNextPage
  currentPage
}
</page-query>