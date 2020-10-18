<template>
  <blog-card :post="post" :linkTo="false" min-height="40vh">
    <v-container class="pa-0">
      <v-row class="d-flex justify-space-between">
        <v-col class="flex-grow-0 flex-shrink-0">
          <g-link v-if="$page.prev" :to="$page.prev.path">
            <v-btn link elevation="0">
              <fa-icon :icon="$icons.prev" class="ma-2" />
              Older<span class="d-none d-md-flex">: {{ $page.prev.title }}</span>
            </v-btn>
          </g-link>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-0">
          <g-link v-if="$page.next" :to="$page.next.path">
            <v-btn link elevation="0">
              Newer<span class="d-none d-md-flex">: {{ $page.next.title }}</span>
              <fa-icon :icon="$icons.next" class="ma-2" />
            </v-btn>
          </g-link>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-space-around text-center">
        <v-col cols="12" sm="6" md="4" v-if="series">
          <g-link :to="series.path" class="white--text">
            <v-card color="primary">
              <v-card-title> Series: {{ series.title }} </v-card-title>
              <bg-image
                :image="series.image.path"
                :license="series.image.license"
                class="align-end d-flex secondary--text pa-0"
                style="min-height: 80px"
              >
              </bg-image>
            </v-card>
          </g-link>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="false">
          <v-card>
            <v-card-text>You might like</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="post.tags.length > 0" class="pa-0">
          <tag-cloud :tags="post.tags" style="min-height: 180px" />
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
import TagCloud from "../../components/TagCloud.vue";
// import SeriesCard from "../../components/SeriesCard.vue";
export default defineComponent({
  components: { BlogCard, BgImage, TagCloud },
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
    tags
    {
      title
      path
      count
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