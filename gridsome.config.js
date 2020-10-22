require("ts-node/register");

// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const { VuetifyLoaderPlugin } = require("vuetify-loader");
const { DateTime, FixedOffsetZone } = require("luxon");

const siteName = "David Driscoll";
const siteHostname = "www.daviddriscoll.me";
const siteDescription = "Ramblings and Tribulations of a Software Developer";

const today = DateTime.fromJSDate(new Date(), { zone: FixedOffsetZone.utcInstance });

/** @type import('@tyankatsu0105/types-gridsome').Config */
module.exports = {
  siteName: siteName,
  siteUrl: "https://" + siteHostname,
  siteDescription,
  metadata: {
    author: {
      username: 'David Driscoll',
      firstName: 'David',
      lastName: 'Driscoll',
      twitter: '@david_dotnet'
    },
    build: {
      today: today.toJSDate(),
      year: today.year,
      month: today.month,
      day: today.day,
      monthOfYear: today.monthLong,
      dayOfWeek: today.toFormat("cccc"),
    },
  },

  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()],
  },
  plugins: [
    {
      use: "gridsome-plugin-typescript",
    },

    {
      use: "@gridsome/source-filesystem",
      options: {
        typeName: "Series",
        path: "series/**/*.yml",
        /*
        refs: {
              // Reference to existing authors by id.
              author: 'Author',
              // Create a Tag content type and its nodes automatically.
              tags: {
                typeName: 'Tag',
                create: true
              }
            }
            */
      },
    },

    // {
    //   use: "@gridsome/vue-remark",
    //   options: {
    //     typeName: "BlogPost", // Required
    //     baseDir: "./posts", // Where .md files are located
    //     template: "./src/templates/BlogPost.vue", // Optional
    //     route: "/blog/:year/:month/:day/:slug",

    //     refs: {
    //       series: "Series",
    //       tags: {
    //         typeName: "Tag",
    //         create: true,
    //       },
    //     },
    //   },
    // },

    {
      use: "@gridsome/source-filesystem",
      options: {
        typeName: "BlogPost",
        path: "./posts/**/*.md",

        refs: {
          series: "Series",
          tags: {
            typeName: "Tag",
            create: true,
          },
        },
      },
    },

    // {
    //   use: "@gridsome/source-filesystem",
    //   options: {
    //     typeName: "BlogPost",
    //     path: "posts/**/*.md",
    //     /*
    //     refs: {
    //           // Reference to existing authors by id.
    //           author: 'Author',
    //           // Create a Tag content type and its nodes automatically.
    //           tags: {
    //             typeName: 'Tag',
    //             create: true
    //           }
    //         }
    //         */
    //   },
    // },
    // {
    //   use: "gridsome-plugin-recommender",
    //   options: {
    //     enabled: true,
    //     typeName: "BlogPost",
    //     field: "title",
    //     relatedFieldName: "related",
    //     minScore: 0.01,
    //     maxScore: 1,
    //     minRelations: 3,
    //     maxRelations: 10,
    //     fillWithRandom: false,
    //     debug: false,
    //   },
    // },
    // todo flex search

    {
      use: "@gridsome/plugin-sitemap",
      options: {
        config: {
          "/blog/*": {
            changefreq: "weekly",
            priority: 0.5,
          },
        },
      },
    },

    {
      use: "@microflash/gridsome-plugin-feed",
      options: {
        // (required) Provide GraphQL collection types
        contentTypes: ["BlogPost"],

        // (optional) Properties used by feed API
        // See https://github.com/jpmonette/feed#example for all options
        feedOptions: {
          title: siteName + " Blog",
          description: siteDescription,
          // image: "http://example.com/image.png",
          // favicon: "http://example.com/favicon.ico",
          // copyright: "All rights reserved 2013, John Doe",
          // author: {
          //   name: "John Doe",
          //   email: "johndoe@example.com",
          //   link: "https://example.com/johndoe"
          // }
        },

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
        maxItems: 100,

        // (optional) an array of properties to be parsed as HTML
        // Converts relative URLs to absolute URLs
        // You can disable this by omitting the option
        htmlFields: ["content"],

        // (optional) appends a trailing slash to the URLs
        enforceTrailingSlashes: false,

        // (optional) a function to filter out the nodes
        // e.g., filter out all outdated posts, filterNodes: (node) => !!node.outdated
        filterNodes: (node) => true,

        // (optional) sets the properties on each feed item
        // See https://github.com/jpmonette/feed#example for all options
        nodeToFeedItem: (node) => ({
          title: node.title,
          date: node.date,
          description: node.description || "",
          link: "https://" + siteHostname + node.path,
          content: node.content,
          author: [
            { name: "David Driscoll", email: "david.driscoll@gmail.com" },
          ],
        }),
      },
    },

    {
      use: "gridsome-plugin-robots-txt",
      options: {
        host: "https://" + siteHostname,
        sitemap: "https://" + siteHostname + "/sitemap.xml",
        policy: [
          {
            userAgent: "Googlebot",
            allow: "/",
            disallow: "/search",
            crawlDelay: 2,
          },
          {
            userAgent: "*",
            allow: "/",
            disallow: "/search",
            crawlDelay: 10,
            cleanParam: "ref /blog/",
          },
        ],
      },
    }
  ],
  templates: {
    // BlogPost: "/blog/:year/:month/:day/:title",
    Tag: '/tags/:title'
  },
  transformers: {
    remark: {
      plugins: [
        [require('./code-highlighting'), { skipInline: true }],
        ["gridsome-remark-figure-caption", {}],
      ],
      // https://webstone.info/documentation/gridsome-plugin-remark-embed/
      /*
            [ '@noxify/gridsome-plugin-remark-embed', {
                'enabledProviders' : ['Youtube', 'Twitter', 'Gist'],
            }]
             */
    },
  },
  prefetch: { mask: '^$', },
};
