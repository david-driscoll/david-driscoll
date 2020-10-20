<template>
  <bg-image
    :image="imagePath"
    :license="licenseValue"
    :position="position"
    :size="size"
  >
    <v-container
      v-if="title || description"
      style="min-height: 15vw"
      class="d-flex justify-center align-center flex-column white--text pa-0"
    >
      <h1 v-html="title" v-if="title" :style="{ 'font-size': `${15/3}vw` }" />
      <slot name="description">
        <h3 class="headline" v-html="description" :style="{ 'font-size': `${15/10}vw`, 'line-height': 1 }" v-if="description" />
      </slot>
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
  </bg-image>
</template>

<script lang="ts">
import BgImage from "../components/BgImage.vue";
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    position: {
      type: String as PropType<string>,
      required: false,
      default: "top",
    },
    size: {
      type: String as PropType<"auto" | "contain" | "cover">,
      required: false,
      default: "contain",
      validator(value: "auto" | "contain" | "cover") {
        return ["auto", "contain", "cover"].some((z) => z === value);
      },
    },
    image: [Object, String] as PropType<
      | string
      | {
          path: string;
          license?: {
            attribution?: { name?: string; url: string };
            author?: { name?: string; url: string };
            original?: { name?: string; url: string };
          };
        }
    >,
    title: String as PropType<string>,
    description: String as PropType<string>,
    overlay: Boolean as PropType<boolean>,
    fluid: Boolean as PropType<boolean>,
  },
  setup() {
    return {};
  },
  components: { BgImage },
  computed: {
    imagePath(): string | undefined {
      return typeof this.image === "string"
        ? this.image
        : this.image && this.image.path;
    },
    licenseValue(): object | undefined {
      if (typeof this.image === "string") return undefined;
      return this.image?.license;
    },
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
.image {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
  height: 15vw;
}
:root .container {
  z-index: 5;
  position: relative;
}
</style>