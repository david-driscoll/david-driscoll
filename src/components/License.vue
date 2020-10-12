<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        outlined
        v-bind="attrs"
        v-on="on"
        small
        :class="{
          'deep-purple--text': true,
          'text--accent-1': !$vuetify.theme.dark,
          'text--accent-4': $vuetify.theme.dark,
        }"
      >
        <fa-icon
          :class="{
            'ma-1': true,
          }"
          :icon="$icons.info"
        />
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline accent"> License Info </v-card-title>

      <v-list>
        <v-list-item v-if="license.attribution">
          <v-list-item-content>
            <v-list-item-subtitle> Attributed to </v-list-item-subtitle>

            <v-list-item-title
              ><a :href="license.attribution.url" target="_blank">{{
                license.attribution.name || license.attribution.url
              }}</a></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="license.author">
          <v-list-item-content>
            <v-list-item-subtitle> Author </v-list-item-subtitle>

            <v-list-item-title
              ><a :href="license.author.url" target="_blank">{{
                license.author.name || license.author.url
              }}</a></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="license.original">
          <v-list-item-content>
            <v-list-item-subtitle> Original </v-list-item-subtitle>

            <v-list-item-title
              ><a :href="license.original.url" target="_blank">{{
                license.original.name || license.original.url
              }}</a></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    license: {
      type: Object as PropType<{
        attribution?: { name?: string; url: string };
        author?: { name?: string; url: string };
        original?: { name?: string; url: string };
      }>,
      required: true,
    },
  },
  setup(props, context) {
    return {
      dialog: ref(false),
    };
  },
});
</script>

<style lang="scss" scoped>
</style>