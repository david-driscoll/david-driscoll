import path from "path";
import url from "url";
import { Feed } from "feed";
import moment from "moment";
import fs from "fs";
import { FeedOptions } from "feed/lib/typings";

function urlWithBase(path: string, base: string, enforceTrailingSlashes = false) {
  if (enforceTrailingSlashes && !path.endsWith("/") && !/\.[a-z]{1,4}$/i.test(path)) {
    path = path + "/";
  }
  return new url.URL(path, base).href;
}

function convertToSiteUrls(html, baseUrl, enforceTrailingSlashes) {
  // Currently playing it conservative and only modifying things that are explicitly relative URLs
  const relativeRefs = /(href|src)=("|')((?=\.{1,2}\/|\/).+?)\2/gi;
  return html.replace(relativeRefs, (_, attribute, quote, relUrl) => {
    return [attribute, "=", quote, urlWithBase(relUrl, baseUrl, enforceTrailingSlashes), quote].join("");
  });
}

function ensureExtension(path, extension) {
  if (path.endsWith(extension)) return path;
  if (path.endsWith("/")) {
    return `${path.substring(0, path.length - 1)}${extension}`;
  }
  return `${path}${extension}`;
}

export function exportFeeds(api: any, config: any) {
  const options = {
    // (required) Provide GraphQL collection types
    contentTypes: ["BlogPost"],

    // Available options with their default values

    // (optional) Options for feed formats
    // RSS is enabled by default
    rss: {
      enabled: true,
      output: "/feed.xml",
    },
    atom: {
      enabled: true,
      output: "/feed.atom",
    },
    json: {
      enabled: true,
      output: "/feed.json",
    },

    // (optional) number of items to include in a feed
    maxItems: 20,

    // (optional) an array of properties to be parsed as HTML
    // Converts relative URLs to absolute URLs
    // You can disable this by omitting the option
    htmlFields: ["content"],

    // (optional) appends a trailing slash to the URLs
    enforceTrailingSlashes: false,
  };
  // console.log(Object.keys(api));

  api.onInit(function (this: any) {
    // console.log('init', this)
    // console.log(Object.keys(this));
    return Promise.resolve();
  });

  let rssOutput;
  let atomOutput;
  let jsonOutput;
  let feed: Feed;

  api.onBootstrap(async function (this: any, arg: any) {
    const { config } = api._app;
    const graphql = api._app.graphql;

    if (!config.siteUrl) {
      throw new Error("Feed plugin is missing required global siteUrl config.");
    }
    if (!options.contentTypes || !options.contentTypes.length) {
      throw new Error("Feed plugin is missing required `options.contentTypes` setting.");
    }

    const pathPrefix = config.pathPrefix !== "/" ? config.pathPrefix : "";
    const siteUrl = config.siteUrl;
    const siteHref = urlWithBase(pathPrefix, siteUrl, options.enforceTrailingSlashes);
    const feedOptions: FeedOptions = {
      generator: "Gridsome Feed Plugin",
      id: siteHref,
      link: siteHref,
      ...{
        title: config.siteName + " Blog",
        description: config.siteDescription,
        // image: "http://example.com/image.png",
        // favicon: "http://example.com/favicon.ico",
        copyright: `All rights reserved ${config.metadata.year}`,
        author: {
          name: config.metadata.name,
          email: config.metadata.email,
          link: config.metadata.siteUrl,
        },
      },
      feedLinks: {},
    };
    rssOutput = options.rss.enabled ? ensureExtension(options.rss.output, ".xml") : null;
    atomOutput = options.atom.enabled ? ensureExtension(options.atom.output, ".atom") : null;
    jsonOutput = options.json.enabled ? ensureExtension(options.json.output, ".json") : null;
    if (rssOutput) {
      feedOptions.feedLinks.rss = urlWithBase(pathPrefix + rssOutput, siteUrl);
    }
    if (atomOutput) {
      feedOptions.feedLinks.atom = urlWithBase(pathPrefix + atomOutput, siteUrl);
    }
    if (jsonOutput) {
      feedOptions.feedLinks.json = urlWithBase(pathPrefix + jsonOutput, siteUrl);
    }
feed = new Feed(feedOptions);

    const result = await graphql(`
      #graphql
      query {
        posts: allBlogPost(sort: { by: "date", order: ASC }, filter: { isFuture: { ne: true }, isDraft: { ne: true } }) @paginate {
          edges {
            node {
              id
              title
              date
              path
              description
              excerpt(length: 1000)
            }
          }
        }
      }
    `);

    /*

            title: node.title,
            date: node.date,
            description: node.description || "",
            link: "https://" + siteHostname + node.path,
            content: node.content,
            author: [{ name: "David Driscoll", email: "david.driscoll@gmail.com" }],
        */

    function nodeToFeedItem(node) {
      console.log(node);
      return {
        id: "",
        title: node.title,
        date: moment(node.date).toDate(),
        description: node.description || "",
        link: "https://" + config.siteHostname + node.path,
        content: node.excerpt,
        author: [{ name: "David Driscoll", email: "david.driscoll@gmail.com" }],
      };
    }
    let feedItems: any[] = [];
    console.log(result);
    for (const node of result.data.posts.edges.map((z) => z.node)) {
      console.log(node);
      // We're mapping to feed items here instead of after sorting in case the data needs
      // to be massaged into the proper format for a feed item (e.g. if the node has a date
      // in a field named something other than `date`). This is slower because we process
      // items that may not get included in the feed, but it's build time, so... ¯\_(ツ)_/¯

      const feedItem = nodeToFeedItem(node);
      feedItem.id = urlWithBase(pathPrefix + node.path, siteUrl, options.enforceTrailingSlashes);
      feedItem.link = feedItem.id;

      feedItems.push(feedItem);
    }
    feedItems.sort((a, b) => {
      const aDate = moment(a.date);
      const bDate = moment(b.date);
      if (aDate.isSame(bDate)) return 0;
      return aDate.isBefore(bDate) ? 1 : -1;
    });
    if (options.maxItems && feedItems.length > options.maxItems) {
      feedItems = feedItems.slice(0, options.maxItems);
    }

    // Process URLs and ensure they are site-relative for any fields that might contain HTML
    for (const item of feedItems) {
      if (options.htmlFields && options.htmlFields.length) {
        for (const field of options.htmlFields) {
          if (!item[field]) continue;
          item[field] = convertToSiteUrls(item[field], item.link, options.enforceTrailingSlashes);
        }
      }
      feed.addItem(item);
    }

    return Promise.resolve();
  });
  api.afterBuild(async ({ config, graphql }: any) => {
    if (rssOutput) {
      console.log(`Generate RSS feed at ${rssOutput}`);
      fs.writeFileSync(path.join(config.outputDir, rssOutput), feed.rss2());
    }
    if (atomOutput) {
      console.log(`Generate Atom feed at ${atomOutput}`);
      fs.writeFileSync(path.join(config.outputDir, atomOutput), feed.atom1());
    }
    if (jsonOutput) {
      console.log(`Generate JSON feed at ${jsonOutput}`);
      fs.writeFileSync(path.join(config.outputDir, jsonOutput), feed.json1());
    }
  });
}
