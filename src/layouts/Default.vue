<template>
  <v-container>
    <v-row>
      <v-col class="flex-shrink-0 flex-grow-1">
        <v-sheet min-height="80vh" rounded="lg">
          <slot />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style scoped>
</style>