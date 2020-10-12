<template>
  <v-container fluid class="pa-0">
    <v-img
      :src="image"
      v-if="image"
      aspect-ratio="16/4"
      height="400"
      class="pa-2 align-end"
    >
      <v-container>
        <h1 v-html="title" v-if="title" />
        <h3 v-html="description" v-if="description" />
      </v-container>
    </v-img>

    <v-container>
      <v-row>
        <v-col class="flex-shrink-0 flex-grow-1">
          <v-sheet min-height="80vh" rounded="lg">
            <slot />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    image: String as PropType<string>,
    title: String as PropType<string>,
    description: String as PropType<string>,
  },
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