import { getTheme, getHighlighter, IThemedToken } from "shiki";
import { BUNDLED_LANGUAGES } from "shiki-languages";
import { BUNDLED_THEMES, IShikiTheme, loadTheme } from "shiki-themes";
import { IRawThemeSetting } from "vscode-textmate";
import { Highlighter } from "shiki/dist/highlighter";
import visit from "unist-util-visit";
import type { Node } from "unist";
import { from, toArray, of, concat } from "ix/iterable";
import { map, concatAll, concatWith, distinct } from "ix/iterable/operators";
import { writeFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { HtmlRendererOptions } from "shiki/dist/renderer";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";
import { GithubData } from "./github-links";

var grey = Object.freeze({
  base: "#9e9e9e",
  lighten5: "#fafafa",
  lighten4: "#f5f5f5",
  lighten3: "#eeeeee",
  lighten2: "#e0e0e0",
  lighten1: "#bdbdbd",
  darken1: "#757575",
  darken2: "#616161",
  darken3: "#424242",
  darken4: "#212121",
});

const CLASS_BLOCK = "shiki";
const CLASS_INLINE = "shiki-inline";

const darkTheme = getTheme("material-theme-darker");
const lightTheme = getTheme("material-theme-lighter");
// const darkTheme = getTheme('dark-plus');
// const lightTheme = getTheme('light-plus');

const lightVariableList = getVariableList(lightTheme);
const darkVariableList = getVariableList(darkTheme);
const variableTokens = new Map<string, string>();
for (const [fakeColor, _, variable] of toArray(darkVariableList)) {
  variableTokens.set(fakeColor.toUpperCase(), variable);
}
variableTokens.set('#000000', 'var(--shiki-foreground)');

const css = `
.shiki, .shiki-header {
${toArray(lightVariableList)
  .map((z) => z[1])
  .join("\n")}
  /*--shiki-background: var(--v-info-lighten4);*/
  --shiki-background: ${grey.lighten3};
  --shiki-foreground: ${lightTheme.fg};
}

@media (prefers-color-scheme: dark) {
.shiki, .shiki-header {
${toArray(darkVariableList)
  .map((z) => z[1])
  .join("\n")}
  /*--shiki-background: var(--v-info-darken4);*/
  --shiki-background: ${grey.darken3};
  --shiki-foreground: ${darkTheme.fg};
}
}

.theme--light {
  .shiki, .shiki-header {
  ${toArray(lightVariableList)
    .map((z) => z[1])
    .join("\n")}
    /*--shiki-background: var(--v-info-lighten4);*/
    --shiki-background: ${grey.lighten3};
    --shiki-foreground: ${lightTheme.fg};
  }
}
.theme--dark {
  .shiki, .shiki-header {
  ${toArray(darkVariableList)
    .map((z) => z[1])
    .join("\n")}
    /*--shiki-background: var(--v-info-darken4);*/
    --shiki-background: ${grey.darken3};
    --shiki-foreground: ${darkTheme.fg};
  }
}

.shiki-header {
  padding: 0.5em;
  margin: 2em;
  margin-bottom: 0;
  & + .shiki {
    margin-top: 0;
  }
  background-color: var(--shiki-foreground);
  &, a {
    color: var(--shiki-background) !important;
  }
  .caption {
    line-height: 1rem !important;
  }
  pre {
    display: inline;
  }

}

.shiki {
  margin: 2em;
  border-left: 0px solid var(--shiki-foreground);
  code {
    padding: unset !important;
    padding: 0.5em !important;
    display: block;
    background-color: unset !important;
    margin: unset !important;
    border-radius: unset !important;
  }
}

.line-number {
  color: var(--shiki-background);
}
`;

writeFileSync(join(__dirname, "static", "generated", "shiki.scss"), css);

const ERROR_MESSAGE = "<code>ERROR Rendering Code Block</code>";

const theme = convertTheme(darkTheme);

module.exports = (options: Partial<{ theme: string; skipInline: boolean }>) => {
  return async (tree: Node) => {
    const highlighter = await getHighlighter({ theme });

    visit(tree, "code", (node) => {
      node.type = "html";
      try {
        // console.log(node);
        node.value = highlight(node as any, CLASS_BLOCK, highlighter);
      } catch (e) {
        node.value = ERROR_MESSAGE;
      }
    });

    if (!options.skipInline) {
      visit(tree, "inlineCode", (node) => {
        node.type = "html";
        try {
          node.value = highlight(node as any, CLASS_INLINE, highlighter);
        } catch (e) {
          node.value = ERROR_MESSAGE;
        }
      });
    }
  };
};

const htmlEscapes: any = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(html: string) {
  return html.replace(/[&<>"']/g, function (chr) {
    return htmlEscapes[chr];
  });
}

function renderer(lines: IThemedToken[][], options?: HtmlRendererOptions & { lineNumber?: number, github?: GithubData }) {
  if (options === void 0) {
    options = {};
  }
  var bg = options.bg || "#fff";
  var html = "";

  const totalLines = (options.lineNumber ?? 0) + lines.length;
  const totalLineLength = totalLines.toString().length;
  const margin = typeof options.lineNumber === 'number' ? (totalLines).toString().length + .5 : 0;
  if (options.github) {
    html += `<div class="shiki-header rounded-t">
    <div class="caption">
      <a href="${options.github.url}" target="_blank" rel="nofollow noopener noreferrer">${options.github.repo}/${options.github.path}</a>
    </div>
    <div class="caption">
      ${options.github.lineEnd > options.github.line ? `Lines <pre>${options.github.line}</pre> to <pre>${options.github.lineEnd}</pre>` : `Line <pre>${options.github.line}</pre>`}
      in <a href="https://github.com/${options.github.owner}/${options.github.repo}/tree/${options.github.ref}" target="_blank" rel="nofollow noopener noreferrer">${options.github.ref.length > 8 ? options.github.ref.substring(0, 8) : options.github.ref}</a>
    </div>
    </div>
    `
  }
  html += `<pre class="shiki" style="background-color: ${bg}; border-left-width: ${margin}em">`;
  // if (options.langId) {
  //   html += `<div class="language-id">${options.langId}</div>`;
  // }
  html += "<code>";
  let ln = options.lineNumber ?? 1;
  for (const line of lines) {
    if (line.length === 0) {
      html += "\n";
    } else {
      html += `<span class="line">`;
      if (typeof options.lineNumber === 'number') {
        const padding = totalLineLength - ln.toString().length;
        html+= `<span class="line-number" style="margin: auto ${margin}em auto -${margin}em">${' '.repeat(padding)}${ln++}</span>`
      }
      for (const token of line) {
        html += `<span style="color: ${variableTokens.get(token.color ?? '') || options.fg}">${escapeHtml(token.content)}</span>`;
      }
      html += "</span>\n";
    }
  }
  html = html.replace(/\n*$/, ""); // Get rid of final new lines
  html += "</code></pre>";
  return html;
}

function highlight({ value, lang, line , github}: { value: any; lang: string; line?: number, github?: GithubData   }, cls: string, highlighter: Highlighter) {
  // all file extensions aren't included

  if (lang === "cs") lang = "c#";
  let index = BUNDLED_LANGUAGES.findIndex((x) => x.id === lang || x.aliases?.includes(lang));

  // console.log("lang", lang, "index", index, highlighter.codeToHtml);

  if (index >= 0) {
    let lines = highlighter.codeToThemedTokens!(value, lang);
    return renderer(lines, { bg: theme.bg, fg: theme.fg, langId: lang, lineNumber: line, github  });
    // const regex = new RegExp(`\<span style="(.*?)#000000(.*?)"\>`, "gi");
    // highlightedCode = highlightedCode.replace(regex, `<span style="$1var(--shiki-foreground)$2">`);

    // console.log(highlightedCode);
    // return highlightedCode;
  }

  // const theme = getTheme("nord");
  // Fallback for unknown languages.
  return `<code class="${cls}" style="background: ${theme.bg}; color: ${(theme as any).colors["terminal.foreground"]}">${escape(value)}</code>`;
}

function escape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function convertTheme(theme: IShikiTheme): IShikiTheme {
  theme.fg = "var(--shiki-foreground)";
  theme.bg = "var(--shiki-background)";
  if ((theme as any).colors) {
    toCssVariables((theme as any).colors);
  }
  if ((theme as any).semanticTokenColors) {
    toCssVariables((theme as any).semanticTokenColors);
  }
  if (theme.settings) {
    for (const item of theme.settings) {
      toCssVariables(item.settings, item.scope);
    }
    const tokenColors: IRawThemeSetting[] = (theme as any).tokenColors;
    for (const item of tokenColors) {
      toCssVariables(item.settings, item.scope);
    }
  }

  // console.log(newTheme.settings);
  // console.log(theme);
  // console.log(theme.settings[0]);

  // console.log(theme);
  return theme;
}

function getVariableList(theme: IShikiTheme) {
  return toArray(
    concat(
      // [[`--shiki-background: ${theme.bg};`],[`--shiki-foreground: ${theme.fg};`]],
      getAllSettings(theme).pipe(
        map((value) => {
          return getCssVariables(value.settings, value.scope);
        }),
        concatAll(),
        concatWith(getCssVariables((theme as any).semanticTokenColors)),
        concatWith(getCssVariables((theme as any).colors))
      )
    ).pipe(
      distinct({
        keySelector: ([key, _]) => key,
      })
    )
  );
}

function getAllSettings(theme: IShikiTheme) {
  return from(theme.settings);
}
// function getAllSettings(theme: IShikiTheme) {
//   return from(theme.settings)
//     .pipe(map(settings => {
//       if (Array.isArray(settings.scope)) {
//         return from(settings.scope)
//           .pipe(map(scope => {
//             return ({
//               ...settings,
//               scope
//             });
//           }))
//       } else {
//         return of(settings);
//       }
//     }),

//       concatAll()
//     );
// }

function toCssVariables(
  c: IRawThemeSetting["settings"],
  scope?: string | string[]
): {
  fontStyle?: string;
  foreground?: string;
  background?: string;
} {
  if (!c) {
    return c;
  }
  const a: any = c;
  for (let [key, value] of Object.entries(c)) {
    const fakeColor = scope ? hashValue(scope + key) : hashValue(key);
    //  if (key === 'foreground' || key === 'background') {
    a[key] = "#" + fakeColor;
    //  }
  }
  return a;
}
function* getCssVariables(c: IRawThemeSetting["settings"], scope?: string | string[]) {
  if (!c) {
    return;
  }

  for (let [key, value] of Object.entries(c)) {
    const fakeColor = scope ? hashValue(scope + key) : hashValue(key);
    // yield `--shiki-${scope ? hashValue(scope).replace(/[\.|\s]/g, '-') + '-' : ''}${key.replace(/[\.|\s]/g, '-')}: ${value};`
    yield [
      "#" + fakeColor,
      `--shiki-${scope ? hashValue(scope).replace(/[\.|\s]/g, "-") + "-" : ""}${key.replace(/[\.|\s]/g, "-")}: ${value};`,
      `var(--shiki-${scope ? hashValue(scope).replace(/[\.|\s]/g, "-") + "-" : ""}${key.replace(/[\.|\s]/g, "-")})`,
    ] as const;
  }
}

function hashValue(value: string | string[]) {
  if (!Array.isArray(value)) value = [value];

  const hasher = createHash("sha256");
  for (const key of value) {
    hasher.update(Buffer.from(key));
  }
  return hasher.digest("hex").substring(0, 8);
}
