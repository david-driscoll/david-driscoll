<template>
  <Layout>
    <series-card
      v-for="series in $page.series.edges"
      :key="series.node.id"
      :series="series.node"
      :posts="series.node.belongsTo.edges.map((z) => z.node)"
    />
    <Pager :info="$page.series.pageInfo" />
  </Layout>
</template>

<page-query>
query ($page: Int) {
  series: allSeries(perPage: 2, page: $page, filter: { hasPosts: { eq:true }}) @paginate {
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
              name,
              url
            },
            author{name, url}
            original{name, url}
          }
        }
        belongsTo(sort: { by:"date", order: ASC }) {
          totalCount
          pageInfo { ...pageInfo }
          edges {
            node {
              ... on BlogPost {
                id,
                path
                title
                date
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

<script>
import { Pager } from "gridsome";
import SeriesCard from "../../components/SeriesCard.vue";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {};
  },
  components: { Pager, SeriesCard },
  metaInfo: {
    title: "Series",
  },
});
</script>
