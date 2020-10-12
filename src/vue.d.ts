import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

declare module "vue/types/vue" {
  interface Vue {
    $icons: Record<string, IconDefinition>;
    $static: Record<string, any>;
    $page: Record<string, any>;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V> {
    icons?: Record<string, IconDefinition>;
  }
}
