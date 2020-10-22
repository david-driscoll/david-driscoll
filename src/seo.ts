import { faArrowAltCircleLeft } from "@fortawesome/pro-duotone-svg-icons";
import path from "path";
import type { MetaInfo } from "vue-meta";

const defaults = {
  name: false,
  description: false,
  canonical: "auto",
};

const template = {
  name: { content: true },
  subtitle: { content: true },
  author: { content: true },
  replyTo: { id: "reply-to", content: true },
  description: { content: true },
  keywords: { content: true },
  url: { content: true },
  // noindex: { ids: ["robots", "googlebot"], content: true, value: ["index", "follow"] },
  // robots: { ids: ["robots", "googlebot"], content: true },
  twitter: {
    id: "twitter",
    title: { default: "title", content: true },
    description: { default: "description", content: true },
    card: { content: true },
    type: { id: "card", content: true },
    site: { content: true },
    creator: { content: true },
  },
};

export function createMeta(this: Vue, options: Seo, inputMeta: MetaInfo): MetaInfo {
  const output: NonNullable<MetaInfo["meta"]> = inputMeta.meta ?? (inputMeta.meta = []);

  const og: NonNullable<MetaInfo["meta"]> = [];
  const twitter: NonNullable<MetaInfo["meta"]> = [];
  options.article = options.article ?? {};

  if (inputMeta.title) {
    options.title = inputMeta.title;
  } else if (options.title) {
    inputMeta.title = options.title;
  }

  if (this.$static) {
    inputMeta.link = inputMeta.link ?? [];

    options.name = this.$static.metadata?.siteName ?? false;
    options.description = this.$static.metadata?.siteDescription ?? false;
    if (this.$static.metadata?.siteUrl) {
      inputMeta.link.push(
        { rel: "canonical", href: `${this.$static.metadata?.siteUrl}${this.$route.fullPath}/` },
        { rel: "alternate", type: 'application/rss+xml', href: `${this.$static.metadata?.siteUrl}/feed.xml` },
        { rel: "alternate", type: 'application/atom+xml', href: `${this.$static.metadata?.siteUrl}/feed.atom` },
      );

      og.push({ key: "url", property: "url", content: `${this.$static.metadata?.siteUrl}${this.$route.fullPath}/` });
    }
    if (this.$static.metadata?.author) {
      options.article.author = [
        {
          firstName: this.$static.metadata.author.firstName,
          lastName: this.$static.metadata.author.lastName,
          username: this.$static.metadata.author.username,
        },
      ];
    }
    if (this.$static.metadata?.author?.twitter) {
      twitter.push({ key: "site", property: "site", content: this.$static.metadata?.author?.twitter });
    }
  }
  if (this.$page) {
    if (this.$page?.post?.date) {
      options.article.publishedTime = this.$page.post?.date;
      options.article.modifiedTime = this.$page.post?.date;
    }
    if (this.$page.image) {
      options.image = options.image ?? {};
      options.image.url = this.$page.image?.path ?? this.$page.image;
      if (options.image.url?.includes("generated/")) options.image.url = undefined;
    }
  }

  output.push({ key: "language", property: "language", content: "English" });
  output.push({ key: "lang", property: "lang", content: "en" });
  if (options.title) {
    output.push({
      key: "title",
      name: "title",
      template: inputMeta.titleTemplate! as any,
      content: options.title
    });
    og.push({
      key: "title",
      property: "title",
      template: inputMeta.titleTemplate! as any,
      content: options.title
    });
    twitter.push({
      key: "title",
      property: "title",
      template: inputMeta.titleTemplate! as any,
      content: options.title
    });
  }
  if (options.description) {
    if (options.description.length > 200) options.description.substring(0, 200);
    output.push({ key: "description", name: "description", content: options.description });
    og.push({ key: "description", property: "description", content: options.description });
    twitter.push({ key: "description", property: "description", content: options.description });
  }

  if (options.name) {
    og.push({ key: "site_name", property: "site_name", content: options.name });
  }

  if (options.copyright) {
    output.push({ key: "copyright", name: "copyright", content: options.copyright });
  }

  if (options.image) {
    if (options.image.url) {
      og.push({ key: "image", property: "image", content: options.image.url });
      og.push({ key: "image:url", property: "image:url", content: options.image.url });
      twitter.push({ key: "image", property: "image", content: options.image.url });
    }
    if (options.image.alt) {
      og.push({ key: "image:alt", property: "image:alt", content: options.image.alt });
      twitter.push({ key: "image:alt", property: "image:alt", content: options.image.alt });
    }
    if (options.image.height) {
      og.push({ key: "image:height", property: "image:height", content: options.image.height.toString() });
    }
    if (options.image.width) {
      og.push({ key: "image:width", property: "image:width", content: options.image.width.toString() });
    }
    if (options.image.type) {
      og.push({ key: "image:type", property: "image:type", content: options.image.type });
    }
  }

  if (options.article) {
    og.push({ key: "type", property: "type", content: "article" });
    if (options.article.publishedTime) {
      const time = typeof options.article.publishedTime === "string" ? options.article.publishedTime : options.article.publishedTime.toISOString();
      output.push({ key: "article:published_time", property: "article:published_time", content: time });
    }
    if (options.article.expirationTime) {
      const time = typeof options.article.expirationTime === "string" ? options.article.expirationTime : options.article.expirationTime.toISOString();
      output.push({ key: "article:expiration_time", property: "article:expiration_time", content: time });
    }
    if (options.article.modifiedTime) {
      const time = typeof options.article.modifiedTime === "string" ? options.article.modifiedTime : options.article.modifiedTime.toISOString();
      output.push({ key: "article:modified_time", property: "article:modified_time ", content: time });
    }
    if (options.article.section) {
      output.push({ key: "article:section", property: "article:section ", content: options.article.section });
    }
    if (options.article.tags) {
      for (const tag of options.article.tags) {
        output.push({ key: "article:tag", property: "article:tag ", content: tag });
      }
    }

    if (options.article.author) {
      for (let i = 0; i < options.article.author.length; i++) {
        const author = options.article.author[i];
        if (author.username) {
          output.push({ key: "article:author:" + i, property: "article:author", content: author.username });
          output.push({ key: "article:author:username:" + i, property: "article:author:username", content: author.username });
        }
        if (author.firstName) {
          output.push({ key: "article:author:first_name:" + i, property: "article:author:first_name", content: author.firstName });
        }
        if (author.lastName) {
          output.push({ key: "article:author:last_name:" + i, property: "article:author:last_name", content: author.lastName });
        }
      }
    }
  }

  if (!og.some((z) => z.property === "type")) {
    og.push({ key: "type", property: "type", content: "website" });
  }
  output.push(
    ...og.map((z) => {
      z.key = `og:${z.key}`;
      z.property = `og:${z.property}`;
      return z;
    })
  );
  output.push(
    ...twitter.map((z) => {
      z.key = `twitter:${z.key}`;
      z.property = `twitter:${z.property}`;
      return z;
    })
  );
  return inputMeta;
}

export { defaults, template };

export interface Profile {
  firstName?: string;
  lastName?: string;
  username?: string;
}
export interface Image {
  url?: string;
  type?: string;
  width?: number;
  height?: number;
  alt?: string;
}
export interface Article {
  publishedTime?: Date | string;
  modifiedTime?: Date | string;
  expirationTime?: Date | string;
  author?: Profile[];
  section?: string;
  tags?: string[];
}
export interface Seo {
  title?: string;
  description?: string;
  name?: string;
  copyright?: string;
  canonical?: string | null;
  // author?: string;
  // url?: string;
  article?: Article;
  image?: Image;
  profile?: Profile;
  twitter?: {
    card?: string;
    type?: string;
    site: { content: true };
    creator: { content: true };
  };
}
