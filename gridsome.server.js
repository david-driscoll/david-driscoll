// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

const { default: slugify } = require("slugify");
const nodeExternals = require("webpack-node-externals");

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

/**
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.$uid
 * @param {string} data.path
 * @param {Date} data.date
 * @param {string[]} [data.tags]
 * @param {string} [data.series]
 * @param {object} data.internal
 * @param {string} data.internal.typeName
 * @param {string} data.internal.origin
 * @param {number} data.internal.timestamp
 */
function onBlogPost(data) {
  data.tags = data.tags ?? [];

  var parts = data.internal.origin.split(/[\/|\\]/g);
  var series = parts.filter((part) => part.startsWith("$series"));
  if (series.length) {
    data.series = series[0].substring("$series".length);
    if (data.series.startsWith("-")) data.series = data.series.substring(1);
  }

  // console.log(data);
}

/**
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.$uid
 * @param {string} data.path
 * @param {string} data.title
 * @param {string} data.description
 * @param {object} data.internal
 * @param {string} data.internal.typeName
 * @param {string} data.internal.origin
 * @param {number} data.internal.timestamp
 * @param {string} data.fileInfo.name
 * @param {string} data.fileInfo.path
 * @param {string} data.fileInfo.extension
 * @param {string} data.fileInfo.directory
 */
function onSeries(data) {
  data.id = data.fileInfo.name;
  data.hasPosts = false;
  // console.log(data);
}

/** @type import('@tyankatsu0105/types-gridsome').Server */
module.exports = function(api) {
  const graphql = api.graphql;
  api.loadSource((actions) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    // console.log(
    //   "// Use the Data Store API here: https://gridsome.org/docs/data-store-api/"
    // );
    // var items = actions.addCollection("BlogPost");
    // console.log(items);
    // const posts = actions.getCollection("BlogPost");
    // posts.addReference("series", "Series");

    const blogs = actions.getCollection("BlogPost");
    const series = actions.getCollection("Series");
    for (const item of series.data()) {
      item.hasPosts = blogs.data().some((z) => z.series === item.id);
    }

    // actions.addSchemaResolvers({
    //   Series: {
    //     hasPosts: {
    //       type: "Boolean",
    //       resolve(obj) {
    //         // const items = actions.getCollection("Series");

    //         // // console.log(Object.keys(items.constructor.prototype));
    //         // console.log(items.data());
    //         // blogs.data().some((z) => z.series === obj.id);
    //         return blogs.data().some((z) => z.series === obj.id);
    //       },
    //     },
    //   },
    // });
  });

  function onCreateNode(data) {
    // console.log(data);
    if (!data.slug) {
      if (data.title) {
        data.slug = slugify(data.title).toLowerCase();
      } else if (data.name) {
        data.slug = slugify(data.name).toLowerCase();
      }
      if (data.path && data.slug) {
        data.path = data.path.replace(/\/slug/g, "/" + data.slug);
      }
    }
  }
  api.onCreateNode(onTypeCreated("BlogPost", onBlogPost));
  api.onCreateNode(onTypeCreated("Series", onSeries));
  api.onCreateNode(onCreateNode);
  // console.log(api);
  api.chainWebpack((config, { isServer }) => {
    if (isServer) {
      config.externals([
        nodeExternals({
          whitelist: [/^vuetify/],
        }),
      ]);
    }
    // console.log(config.plugins);
    // config.plugins.push(new VuetifyLoaderPlugin());
  });

  api.createPages(({ createPage, graphql }) => {
    createPage({
      path: "/series-overview/",
      component: "./src/templates/series/SeriesOverview.vue",
    });
  });
};

/**
 *
 * @param {string} typeName
 * @param {Function} fn
 */
function onTypeCreated(typeName, fn) {
  return onTypeCreatedResult;

  /**
   * @param {object} data
   * @param {string} data.id
   * @param {string} data.$uid
   * @param {string} [data.path]
   * @param {Date} [data.date]
   * @param {object} data.internal
   * @param {string} data.internal.typeName
   * @param {string} data.internal.origin
   * @param {number} data.internal.timestamp
   */
  function onTypeCreatedResult(data) {
    if (data.internal.typeName === typeName) fn(data);
  }
}
