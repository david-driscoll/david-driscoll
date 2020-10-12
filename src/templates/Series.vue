<template>
  <div>{{ $page.series }}</div>
</template>

<page-query>
query ($id: ID!) {
  series: series(id: $id) {
    id
    path
    title
    description
    image {
      path
      license {
        attribution {
          name,
          url
        },
        author{name, url}
        original{name, url}
      }
    }
    belongsTo(sort: { by:"date", order: ASC }) {
      totalCount
      pageInfo {
        totalItems
        hasPreviousPage
        hasNextPage
        isFirst
        isLast
        totalPages
        currentPage
      }
      edges {
        node {
          ... on BlogPost {
            id,
            path
            title
            date
            isFuture
          }
        }
      }
    }
  }
}
</page-query>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
</style>