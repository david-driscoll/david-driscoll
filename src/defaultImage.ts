import { computed, inject, onUnmounted, Ref } from "@vue/composition-api";
import trianglify from "trianglify";

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const colors = ["PuOr", "PRGn", "PiYG", "RdBu", "RdYlBu", "Spectral", "RdYlGn"];
/*Object.keys(trianglify.utils.colorbrewer).filter(
  (z) => !z.endsWith("s")
);*/

export function getImage(key: string) {
  const seed = mulberry32(key)() * colors.length;
  const colorIndex = Math.floor(seed);
  let localColors = (trianglify as any).utils.colorbrewer[colors[colorIndex]];

  const c = localColors
    .slice(Math.floor(localColors.length / 2))
    .concat(localColors.slice(0, Math.ceil(localColors.length / 2)));
  console.log(
    localColors,
    Math.floor(localColors.length / 2),
    Math.ceil(localColors.length / 2),
    c
  );

  const image = trianglify({
    width: 3840,
    height: 960,
    seed: key,
    cellSize: 160,
    xColors: c,
    strokeWidth: 2,
    variance: 0.44,
  } as any) as any;
  var data = image.toSVGTree().toString();
  return `data:image/svg+xml;base64,${Buffer.from(data).toString("base64")}`;
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
