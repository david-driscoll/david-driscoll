// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

const { default: slugify } = require("slugify");
const nodeExternals = require("webpack-node-externals");
const { DateTime } = require("luxon");
const trianglify = require("trianglify");

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const colors = ["PuOr", "PRGn", "PiYG", "RdBu", "RdYlBu", "Spectral", "RdYlGn"];
/*Object.keys(trianglify.utils.colorbrewer).filter(
  (z) => !z.endsWith("s")
);*/

function ensureImage(data, key) {
  if (!data.image) data.image = { path: undefined };
  if (!data.image.path) {
    const seed = mulberry32(key)() * colors.length;
    const colorIndex = Math.floor(seed);
    const image = trianglify({
      width: 3840,
      height: 960,
      seed: key,
      cellSize: 160,
      xColors: trianglify.utils.colorbrewer[colors[colorIndex]],
      strokeWidth: 2,
      variance: 0.44,
    });
    data.image.path = image.toSVG().toString();
    data.image.path = `data:image/svg+xml;base64,${Buffer.from(
      data.image.path
    ).toString("base64")}`;
  }
}

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

  ensureImage(data, data.title);

  let now = DateTime.utc();
  data.isFuture = DateTime.fromJSDate(data.date) > now;

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
  ensureImage(data, data.id);
  data.hasPosts = false;
  data.lastPost = new Date(0);
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
      item.lastPost = item.hasPosts
        ? blogs
            .data()
            .filter((z) => z.series === item.id)
            .reduce(
              (acc, v) => (acc.date > v.date ? acc.date : v.date),
              new Date(0)
            )
        : null;
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
          allowlist: [/^vuetify/],
        }),
      ]);
    }
    // console.log(config.plugins);
    // config.plugins.push(new VuetifyLoaderPlugin());
  });

  api.createPages(({ createPage, graphql }) => {
    createPage({
      path: "/series/",
      component: "./src/templates/series/Summary.vue",
    });
    // createPage({
    //   path: "/series/:id",
    //   component: "./src/templates/series/Index.vue",
    // });
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

function mulberry32(seed) {
  if (!seed) {
    seed = Math.random().toString(36);
  } // support no-seed usage
  var a = xmur3(seed)();
  return function() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
