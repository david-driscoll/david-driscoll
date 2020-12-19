import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

declare module "vue/types/vue" {
  import type { MetaInfo } from "nuxt-meta";
  import type { Seo } from "./seo";
  interface Vue {
    $icons: Record<string, IconDefinition>;
    $static: Record<string, any>;
    $context: Record<string, any>;
    $page: Record<string, any>;
    $$pageTitle: string;
    $seo(options: Seo, inputMeta: MetaInfo): MetaInfo;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V> {
    icons?: Record<string, IconDefinition>;
  }
}
