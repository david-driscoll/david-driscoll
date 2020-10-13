<template>
  <div>
    <v-img :src="image" v-if="image" class="pa-2" contain position="top">
      <v-container
        v-if="title || description"
        style="height: 15vw"
        class="d-flex justify-center align-center"
      >
        <h1 v-html="title" v-if="title" />
        <h3 v-html="description" v-if="description" />
      </v-container>

      <v-container :style="{ 'margin-top': overlay ? '-2vw' : '' }">
        <v-row>
          <v-col class="flex-shrink-0 flex-grow-1">
            <v-sheet min-height="80vh" rounded="lg">
              <slot />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    image: String as PropType<string>,
    title: String as PropType<string>,
    description: String as PropType<string>,
    overlay: Boolean as PropType<boolean>,
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