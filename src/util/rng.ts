export function rng(seed?: string | number | (() => number)) {
  if (typeof seed === "function") return seed;
  return mulberry32(seed);
}

function mulberry32(seed: string | number | undefined) {
  if (!seed) {
    seed = Math.random().toString(36);
  } // support no-seed usage
  var a = xmur3(seed.toString())();
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

export function pickone<T>(list: T[], seed?: string | number | (() => number)) {
  const value = rng(seed)();
  const index = Math.ceil(value * list.length) - 1;
  return list[index];
}

export function bool(seed?: string | number | (() => number)) {
  return rng(seed)() > 0.5;
}
