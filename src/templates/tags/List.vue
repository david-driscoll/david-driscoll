<template>
  <v-container fluid class="pa-6">
    <tag-cloud :tags="$page.tags.edges.map(z => z.node)" />
  </v-container>
</template>

<script lang="ts">
import TagCloud from "../../components/TagCloud.vue";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  components: { TagCloud },
  mounted() {},
  computed: {},
  metaInfo() {
    return {
      title: "Tag Cloud"
    }
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
.container {
  height: 80vh;
  width: 100vw;
}
</style>

<page-query>
query {
  tags: allTag(filter: {}) {
    totalCount
    pageInfo {
      ...pageInfo
    }
    edges {
      node {
        id
        title
        count
        path
        slug
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