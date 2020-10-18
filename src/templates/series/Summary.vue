<template>
  <v-container>
    <v-row>
      <v-col class="flex-shrink-0 flex-grow-1">
        <series-content
          v-for="series in $page.series.edges"
          :key="series.node.id"
          :series="series.node"
          :posts="series.node.posts.edges.map((z) => z.node)"
        />
      </v-col>
    </v-row>
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
</template>

<script lang="ts">
import { DateTime } from "luxon";
import SeriesContent from "../../components/SeriesContent.vue";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {};
  },

  components: { SeriesContent },
  computed: {
    next() {
      if (!this.$page.series.pageInfo.hasNextPage) return undefined;
      const page = this.$route?.params?.page;
      const next = this.$page.series.pageInfo.currentPage + 1;
      const fullPath = this.$route.fullPath;
      return page
        ? fullPath.substring(0, fullPath.lastIndexOf(page.toString())) +
            next.toString() +
            "/"
        : fullPath + "2/";
    },
    prev() {
      if (!this.$page.series.pageInfo.hasPreviousPage) return undefined;
      const page = this.$route?.params?.page;
      const prev = this.$page.series.pageInfo.currentPage - 1;
      const fullPath = this.$route.fullPath;
      return (
        fullPath.substring(0, fullPath.lastIndexOf(page)) +
        (prev === 1 ? "" : prev.toString() + "/")
      );
    },
  },
  metaInfo() {
    return {
      title: "Series",
    };
  },
});
</script>

<page-query>
query ($page: Int) {
  series: allSeries(perPage: 3, page: $page, filter: { hasPosts: { eq: true }}) @paginate {
  # series: allSeries(perPage: 3, page: $page) @paginate {
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