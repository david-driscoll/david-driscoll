import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

declare module "vue/types/vue" {
  interface Vue {
    $icons: Record<string, IconDefinition>;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V> {
    icons?: Record<string, IconDefinition>;
  }
}
