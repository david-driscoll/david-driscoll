<template>
  <Layout :image="image" :title="'About'">
    <v-sheet rounded="lg" min-height="30vh" elevation="2" class="pa-3">
      <p>
        Hello there, welcome to my blog, I hope you
      </p>
    </v-sheet>
    <template v-slot:description> custom desc asdf </template>
  </Layout>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import Layout from "../layouts/Default.vue";
export default defineComponent({
  components: { Layout },
  computed: {
    image() {
      // if (this.$vuetify.theme.dark) return '/pages/about.png';
      return this.$context.image.path;
    },
  },
  setup() {
    return {};
  },
  metaInfo() {
    return this.$seo(
      {
        title: "About",
      },
      {}
    );
  },
});
</script>
