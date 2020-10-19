import { computed, inject, onUnmounted, Ref } from "@vue/composition-api";
import trianglify from "trianglify";
import { createHash } from "crypto";
import { join } from "path";

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

function toRgba(v: ReturnType<typeof hexToRgb>) {
  return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`;
}
function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)!;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] != null ? parseInt(result[4], 16) / 255 : 1
  };
}

const schemes: { [key: string]: string[] } = {
  // YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
  // YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
  // GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
  // BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
  // PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
  PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
  BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
  RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
  PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
  OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
  YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
  // YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
  Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
  Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
  // Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
  // Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
  // Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
  // Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
  PuOr: ["#7f3b08", "#b35806df", "#e08214cf", "#fdb863af", "#fee0b62f", "#f7f7f72f", "#d8daeb2f", "#b2abd2af", "#8073accf", "#542788df", "#2d004b"],
  // BrBG: ["#543005", "#8c510adf", "#bf812dcf", "#dfc27daf", "#f6e8c32f", "#f5f5f52f", "#c7eae52f", "#80cdc1af", "#35978fcf", "#01665edf", "#003c30"],
  // PRGn: ["#40004b", "#762a83df", "#9970abcf", "#c2a5cfaf", "#e7d4e82f", "#f7f7f72f", "#d9f0d32f", "#a6dba0af", "#5aae61cf", "#1b7837df", "#00441b"],
  // PiYG: ["#8e0152", "#c51b7ddf", "#de77aecf", "#f1b6daaf", "#fde0ef2f", "#f7f7f72f", "#e6f5d02f", "#b8e186af", "#7fbc41cf", "#4d9221df", "#276419"],
  RdBu: ["#67001f", "#b2182bdf", "#d6604dcf", "#f4a582af", "#fddbc72f", "#f7f7f72f", "#d1e5f02f", "#92c5deaf", "#4393c3cf", "#2166acdf", "#053061"],
  // RdGy: ["#67001f", "#b2182bdf", "#d6604dcf", "#f4a582af", "#fddbc72f", "#ffffff2f", "#e0e0e02f", "#bababaaf", "#878787cf", "#4d4d4ddf", "#1a1a1a"],
  RdYlBu: ["#a50026", "#d73027df", "#f46d43cf", "#fdae61af", "#fee0902f", "#ffffbf2f", "#e0f3f82f", "#abd9e9af", "#74add1cf", "#4575b4df", "#313695"],
  Spectral: ["#9e0142", "#d53e4fdf", "#f46d43cf", "#fdae61af", "#fee08b2f", "#ffffbf2f", "#e6f5982f", "#abdda4af", "#66c2a5cf", "#3288bddf", "#5e4fa2"],
  // RdYlGn: ["#a50026", "#d73027df", "#f46d43cf", "#fdae61af", "#fee08b2f", "#ffffbf2f", "#d9ef8b2f", "#a6d96aaf", "#66bd63cf", "#1a9850df", "#006837"]
};
for (const scheme of Object.values(schemes)) {
  if (scheme.length == 9) {
    const scale = 208 / (scheme.length - 2);
    for (var i = 0; i < scheme.length; i++) {
      const result = hexToRgb(scheme[i]);
      if (Math.floor(result.a) === 1) {
        result.a = Math.min((47 + scale * i) / 255, 1);
      }
      scheme[i] = toRgba(result);
    }
    scheme.push(...scheme.concat().reverse().slice(1));
  } else {
    for (var i = 0; i < scheme.length; i++) {
      //const c = localColors.slice(Math.floor(localColors.length / 2)).concat(localColors.slice(0, Math.ceil(localColors.length / 2)));
      scheme[i] = toRgba(hexToRgb(scheme[i]));
    }
    scheme.splice(0, scheme.length, ...scheme.slice(Math.floor(scheme.length / 2)).concat(scheme.slice(0, Math.ceil(scheme.length / 2))));
  }
}

// const colors = ["PuOr", "BrBG", "PRGn", "PiYG", "RdBu", "RdGy", "RdYlBu", "Spectral", "RdYlGn"];
const colors = Object.keys(schemes);

/*Object.keys(trianglify.utils.colorbrewer).filter(
  (z) => !z.endsWith("s")
);*/

function getImage(key: string) {
  const data = getImageContent(key);
  return `data:image/svg+xml;base64,${Buffer.from(data).toString("base64")}`;
}

export function getImagePath(key: string, ext = 'svg') {
  return `/generated/${getImageName(key)}.${ext}`.toLowerCase();
}

export function getImageName(key: string) {
  if (key === "/") key = "App";
  const hasher = createHash("sha256");
  hasher.update(Buffer.from(key));
  const hash = hasher.digest("hex");
  // console.log(key, hash);
  return hash;
}

export function getImageContent(key: string) {
  if (key === "/") key = "App";
  const seed = mulberry32(key)() * colors.length;
  const colorIndex = Math.floor(seed);
  let localColors = schemes[colors[colorIndex]];

  // console.log(localColors);
  const image = trianglify({
    width: 3840,
    height: 960,
    seed: key,
    cellSize: 140,
    xColors: localColors,
    yColors: "match",
    strokeWidth: 2,
    variance: 0.44
  } as any) as any;
  return image;
}

function mulberry32(seed: any) {
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

function xmur3(str: string) {
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
