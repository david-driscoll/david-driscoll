import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

declare module "vue/types/vue" {
  import type { MetaInfo } from "nuxt-meta";
  interface Vue {
    $icons: Record<string, IconDefinition>;
    $static: Record<string, any>;
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

declare interface Seo {
  charset?: string;
  baseUrl?: string;
  name?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  lang?: string;
  language?: string;
  copyright?: string;
  canonical?: string | null;
  subtitle?: string;
  author?: [string, string];
  replyTo?: string;
  description?: string;
  url?: string;

  openGraph?: {
    name?: string;
    title?: string;
    description?: string;
    locale?: string;
    url?: string;
    type?: "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other" | "article" | "book" | "profile" | "website";
    profile?: OgProfile;
    article?: OgArticle;
    image?: {}
  };
  // noindex: {
  //   ids: any[];
  //   value: any[];
  // }
  // robots: {
  //   ids: any[];
  // }
}

interface OgProfile {
  firstName: string;
  lastName: string;
  username: string;
}
interface OgImage {
  url: string;
  type: string;
  width: number;
  height: number;
  alt: string;
}
interface OgArticle {
  publishedTime: Date;
  modifiedTime: Date;
  expirationTime: Date;
  author: OgProfile[];
  section: string;
}
