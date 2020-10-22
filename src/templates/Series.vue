<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col class="pa-0">
        <v-card class="mx-auto">
          <bg-image :image="series.image.path" :license="series.image.license" :style="{ 'min-height': '280px' }" class="align-end d-flex secondary--text pa-0">
            <g-link :to="series.path">
              <v-card-title
                :class="{
                  'white--text': true,
                  'rounded-tr-xl': true,
                  primary: true,
                  'darken-4': false,
                  'accent-2': false,
                }"
                style="width: fit-content"
              >
                {{ series.title }}
              </v-card-title>
            </g-link>
          </bg-image>

          <v-card-subtitle v-if="series.description">
            {{ series.description }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-for="(post, i) in posts" :key="post.id">
      <v-col class="pa-0">
        <blog-content :post="post" min-height="60vh" />
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
  series: series(id: $id) {
    id
    path
    title
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
  },
  posts: allBlogPost(sort: {  by:"date", order: DESC }, filter: { isFuture: { ne: true }, series: { id: { eq: $id }  } }) {
    totalCount
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
</page-query>

<script lang="ts">
import BlogContent from "../components/BlogContent.vue";
import BgImage from "../components/BgImage.vue";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  components: { BlogContent, BgImage },
  setup() {
    return {};
  },
  metaInfo() {
    return this.$seo({ title: `Series - ${this.$page.series.title}` }, {});
  },
  computed: {
    series() {
      return this.$page.series;
    },
    posts() {
      return (this.$page.posts.edges as any[]).map((z) => z.node);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>