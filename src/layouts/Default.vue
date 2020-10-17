<template>
  <v-img v-once :src="image" v-if="image" class="pa-2" contain position="top">
    <v-container
      v-if="title || description"
      style="height: 15vw"
      class="d-flex justify-center align-center flex-column white--text pa-0"
    >
      <h1 v-html="title" v-if="title" />
      <h3 class="text-body-1" v-html="description" v-if="description" />
    </v-container>

    <v-container fluid class="pa-0">
      <v-row class="d-flex justify-center">
        <v-col class="flex-shrink-0 flex-grow-0" v-if="hasLeft">
          <slot name="left" />
        </v-col>
        <v-col class="flex-shrink-0 flex-grow-1">
          <v-container
            :style="{ 'margin-top': overlay ? '-2vw' : '' }"
            :fluid="fluid"
            class="pa-0"
          >
            <v-sheet min-height="80vh" rounded="lg">
              <slot />
            </v-sheet>
          </v-container>
        </v-col>

        <v-col class="flex-shrink-0 flex-grow-0" v-if="hasRight">
          <slot name="right" />
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    image: String as PropType<string>,
    title: String as PropType<string>,
    description: String as PropType<string>,
    overlay: Boolean as PropType<boolean>,
    fluid: Boolean as PropType<boolean>,
  },
  setup() {
    return {};
  },
  computed: {
    hasLeft(): boolean {
      return !!this.$slots.left;
    },
    hasRight(): boolean {
      return !!this.$slots.right;
    },
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