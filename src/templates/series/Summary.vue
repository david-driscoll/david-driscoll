<template>
  <v-container>
    <v-row>
      <v-col class="flex-shrink-0 flex-grow-1">
        <series-card
          v-for="series in $page.series.edges"
          :key="series.node.id"
          :series="series.node"
          :posts="series.node.posts.edges.map((z) => z.node)"
        />
        <Pager :info="$page.series.pageInfo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<page-query>
query ($page: Int) {
  series: allSeries(perPage: 5, page: $page, filter: { hasPosts: { eq: true }}) @paginate {
    totalCount
    pageInfo {
      ...pageInfo
    }
    edges {
      node {
        id
        path
        title
        description
        image {
          path
          license {
            attribution {
              name
              url
            }
            author {
              name
              url
            }
            original {
              name
              url
            }
          }
        }
        posts: belongsTo(sort: { by:"date", order: ASC }) {
          totalCount
          pageInfo { ...pageInfo }
          edges {
            node {
              ... on BlogPost {
                id,
                path
                title
                date
                description
                isFuture
              }
            }
          }
        }
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

<script lang="ts">
import { DateTime } from "luxon";
import SeriesCard from "../../components/SeriesCard.vue";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {};
  },

  components: { SeriesCard },
  metaInfo() {
    return {
      title: "Series",
    };
  },
});
</script>
