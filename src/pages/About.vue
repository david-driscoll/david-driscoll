<template>
  <Layout :image="image" :title="'About'">
    <h1>About us</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error doloremque
      omnis animi, eligendi magni a voluptatum, vitae, consequuntur rerum illum
      odit fugit assumenda rem dolores inventore iste reprehenderit maxime!
      Iusto.
    </p>
    <template v-slot:description>
      custom desc asdf
    </template>
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
       return this.$context.image.path
    }
  },
  setup() {
    return {};
  },
  metaInfo() {
    return this.$seo({
      title: "About",
    }, {});
  },
});
</script>
