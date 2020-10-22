<template>
  <Layout> </Layout>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Layout from "../../layouts/Default.vue";
export default defineComponent({
  components: { Layout },
  setup() {
    return {};
  },
  metaInfo() {
    return this.$seo({ title: "Series" }, {});
  },
});
</script>
