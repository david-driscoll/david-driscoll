<template>
  <blog-card :post="post" :linkTo="false" min-height="40vh">
    <v-container class="pa-0">
      <v-row class="d-flex justify-space-between">
        <v-col class="flex-grow-0 flex-shrink-0">
          <g-link v-if="$page.prev" :to="$page.prev.path">
            <v-btn link elevation="0">
              <fa-icon :icon="$icons.prev" class="ma-2" />
              Older: {{ $page.prev.title }}
            </v-btn>
          </g-link>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-0">
          <g-link v-if="$page.next" :to="$page.next.path">
            <v-btn link elevation="0">
              Newer: {{ $page.next.title }}
              <fa-icon :icon="$icons.next" class="ma-2" />
            </v-btn>
          </g-link>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-space-around text-center">
        <v-col cols="12" md="4" v-if="series">
          <series-card :series="series" :posts="seriesPosts" />
          <v-card color="primary">
            <g-link :to="series.path"  class="white--text">
              <v-card-title>
                Series: {{ series.title }}
              </v-card-title>
            </g-link>
            <bg-image
              :image="series.image.path"
              :license="series.image.license"
              class="align-end d-flex secondary--text pa-0"
              style="min-height: 80px"
            >
            </bg-image>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>You might like</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>tags</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </blog-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Layout from "../../layouts/Default.vue";
import BlogCard from "../../components/BlogCard.vue";
import BgImage from "../../components/BgImage.vue";
// import SeriesCard from "../../components/SeriesCard.vue";
export default defineComponent({
  components: { BlogCard, BgImage },
  mounted() {},
  computed: {
    post(): any {
      return this.$page.post;
    },
    series(): any | undefined {
      return this.post?.series;
    },
    seriesPosts(): any | undefined {
      return this.series?.posts?.edges?.map((z: any) => z.node) ?? [];
    },
  },
});
</script>

<style lang="scss" scoped>
</style>

<page-query>
query ($id: ID!, $next: ID, $prev: ID) {
  post: blogPost(id: $id) {
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
  }
  next: blogPost(id: $next) {
    id
    title
    date
    path
  }
  prev: blogPost(id: $prev) {
    id
    title
    date
    path
  }
}
</page-query>