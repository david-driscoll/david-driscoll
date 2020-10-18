<template>
  <v-container class="bg-image" fluid :style="backgroundStyle">
    <slot />

    <license
      v-if="license"
      class="license rounded-bl-xl"
      :class="{ white: !$vuetify.theme.dark, black: $vuetify.theme.dark }"
      :license="license"
    />
  </v-container>
</template>

<style lang="scss" scoped>
.bg-image {
  position: relative;
}
.license {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25em 0.25em 0.5em 0.5em;
}
</style>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    position: {
      type: String as PropType<string>,
      required: false,
      default: 'top'
    },
    size: {
      type: String as PropType<"auto" | "contain" | "cover">,
      required: false,
      default: 'cover',
      validator(value: "auto" | "contain" | "cover") {
        return ["auto", "contain", "cover"].some((z) => z === value);
      },
    },
    image: {
      type: String as PropType<string>,
      required: true,
    },
    license: {
      type: Object as PropType<{
        attribution?: { name?: string; url: string };
        author?: { name?: string; url: string };
        original?: { name?: string; url: string };
      }>,
      required: false,
    },
  },
  computed: {
    backgroundStyle(): object {
      return {
        "background-image": "url(" + this.image + ")",
        // "background-size": "contain",
        "background-position": this.position,
        "background-size": this.size,
      };
    },
  },
  setup(props: any, context: any) {
    return {
      dialog: ref(false),
    };
  },
});
</script>