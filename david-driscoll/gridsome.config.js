// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const { VuetifyLoaderPlugin } = require("vuetify-loader");

/** @type import('@tyankatsu0105/types-gridsome').Config */
module.exports = {
  siteName: "David Driscoll",
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()],
  },
  plugins: [
    {
      use: "gridsome-plugin-typescript",
    },

    {
      use: "@gridsome/plugin-sitemap",
      // options: {
      //   exclude: ['/exclude-me'],
      //   config: {
      //     '/articles/*': {
      //       changefreq: 'weekly',
      //       priority: 0.5,
      //       lastmod: '2020-02-19',
      //     },
      //     '/about': {
      //       changefreq: 'monthly',
      //       priority: 0.7,
      //       lastmod: '2020-05-12',
      //     }
      //   }
      // }
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

    {
      use: "@gridsome/vue-remark",
      options: {
        typeName: "BlogPost", // Required
        baseDir: "./posts", // Where .md files are located
        // pathPrefix: '/docs', // Add route prefix. Optional
        template: "./src/templates/BlogPost.vue", // Optional
        route: "/:year/:month/:day/:slug",

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

    {
      use: "@microflash/gridsome-plugin-feed",
      options: {
        // (required) Provide GraphQL collection types
        contentTypes: ["BlogPost"],

        // (optional) Properties used by feed API
        // See https://github.com/jpmonette/feed#example for all options
        feedOptions: {
          title: "My blog",
          description: "My Personal blog on books, cookies and kittens",
        },

        // Available options with their default values

        // (optional) Options for feed formats
        // RSS is enabled by default
        rss: {
          enabled: true,
          output: "/feed.xml",
        },
        atom: {
          enabled: false,
          output: "/feed.atom",
        },
        json: {
          enabled: false,
          output: "/feed.json",
        },

        // (optional) number of items to include in a feed
        maxItems: 25,

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
          content: node.content,
        }),
      },
    },
    {
      use: "gridsome-plugin-robots-txt",
      options: {
        host: "https://my-awesome-fast-site.com",
        sitemap: "https://my-awesome-fast-site.com/configs/sitemap.xml",
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
            cleanParam: "ref /articles/",
          },
        ],
      },
    },
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
  ],
  templates: {
    // BlogPost: "/blog/:year/:month/:day/:slug",
  },
  transformers: {
    remark: {
      plugins: [
        ["gridsome-remark-figure-caption", {}],
        ["gridsome-plugin-remark-shiki", { theme: "nord", skipInline: true }],
      ],
      // https://webstone.info/documentation/gridsome-plugin-remark-embed/
      /*
            [ '@noxify/gridsome-plugin-remark-embed', {
                'enabledProviders' : ['Youtube', 'Twitter', 'Gist'],
            }]
             */
    },
  },
};
