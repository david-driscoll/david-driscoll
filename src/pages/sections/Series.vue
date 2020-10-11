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
export default defineComponent({
  metaInfo: {
    title: "Series",
  },
});
</script>
