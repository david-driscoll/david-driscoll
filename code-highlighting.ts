import { getTheme, getHighlighter } from "shiki";
import { BUNDLED_LANGUAGES } from "shiki-languages";
import { BUNDLED_THEMES, IShikiTheme, loadTheme } from "shiki-themes";
import { IRawThemeSetting } from "vscode-textmate";
import { Highlighter } from "shiki/dist/highlighter";
import visit from "unist-util-visit";
import type { Node } from 'unist';
import { from, toArray, of, concat } from 'ix/iterable'
import { map, concatAll, concatWith, distinct } from 'ix/iterable/operators'
import { writeFileSync } from 'fs';
import { join } from 'path';
import { createHash } from "crypto";

const CLASS_BLOCK = "shiki";
const CLASS_INLINE = "shiki-inline";

const darkTheme = getTheme('dark-plus');
const lightTheme = getTheme('light-plus');

const lightVariableList = getVariableList(lightTheme);
const darkVariableList = getVariableList(darkTheme);

const css = `
.shiki {
  code {
    background-color: inherit;
  }
}

.shiki {
  --shiki-background: ${lightTheme.bg};
  --shiki-foreground: ${lightTheme.fg};
${toArray(lightVariableList).map(z => z[1]).join('\n')}
}

@media (prefers-color-scheme: dark) {
.shiki {
  --shiki-background: ${darkTheme.bg};
  --shiki-foreground: ${darkTheme.fg};
${toArray(darkVariableList).map(z => z[1]).join('\n')}
}
}

.theme--light .shiki {
  --shiki-background: ${lightTheme.bg};
  --shiki-foreground: ${lightTheme.fg};
${toArray(lightVariableList).map(z => z[1]).join('\n')}
}
.theme--dark .shiki {
  --shiki-background: ${darkTheme.bg};
  --shiki-foreground: ${darkTheme.fg};
${toArray(darkVariableList).map(z => z[1]).join('\n')}
}
`;

writeFileSync(join(__dirname, 'static', 'generated', 'shiki.scss'), css);

const ERROR_MESSAGE = "<code>ERROR Rendering Code Block</code>";

const theme = convertTheme(darkTheme);

module.exports = (options: Partial<{ theme: string; skipInline: boolean }>) => {

  return async (tree: Node) => {
    const highlighter = await getHighlighter({      theme    });

    visit(tree, "code", node => {
      node.type = "html";
      try {
        node.value = highlight(node, CLASS_BLOCK, highlighter);
      } catch (e) {
        node.value = ERROR_MESSAGE;
      }
    });

    if (!options.skipInline) {
      visit(tree, "inlineCode", node => {
        node.type = "html";
        try {

          node.value = highlight(node, CLASS_INLINE, highlighter);
        } catch (e) {
          node.value = ERROR_MESSAGE;
        }
      });
    }
  };
};

function highlight({ value, lang }: any, cls: string, highlighter: Highlighter) {
  const index = BUNDLED_LANGUAGES.findIndex(x => x.id === lang);
  console.log('lang', lang, 'index', index, highlighter.codeToHtml);

  if (index >= 0) {
    let highlightedCode = highlighter.codeToHtml!(value, lang);
    for (const [fakeColor, _, variable] of toArray(darkVariableList)) {
      const regex = new RegExp(`\<span style="(.*?)${fakeColor.toUpperCase()}(.*?)"\>`, 'gi');
      // const regex2 = new RegExp(`${fakeColor.toUpperCase()}`, 'gi');
      // console.log(regex2.test(highlightedCode))
      highlightedCode = highlightedCode.replace(regex, `<span style="$1${variable}$2">`);
    }
    console.log(highlightedCode);
    return highlightedCode
  }

  const theme = getTheme("nord");
  // Fallback for unknown languages.
  return `<code class="${cls}" style="background: ${theme.bg}; color: ${(theme as any).colors["terminal.foreground"]}">${escape(value)}</code>`;
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertTheme(theme: IShikiTheme): IShikiTheme {
    theme.fg= 'var(--shiki-foreground)';
    theme.bg= 'var(--shiki-background)';
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

  return theme;
}

function getVariableList(theme: IShikiTheme) {
  return toArray(concat(
    // [[`--shiki-background: ${theme.bg};`],[`--shiki-foreground: ${theme.fg};`]],
    getAllSettings(theme)
    .pipe(map(value => {
      return getCssVariables(value.settings, value.scope);
    }),
    concatAll(),
      concatWith(getCssVariables((theme as any).semanticTokenColors)),
      concatWith(getCssVariables((theme as any).colors)),
    ))
    .pipe(distinct({
      keySelector: ([key, _]) => key
    })));
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

function toCssVariables(c: IRawThemeSetting['settings'], scope?: string | string[] ): {
  fontStyle?: string;
  foreground?: string;
 background?: string;
} {
  const a: any = c;
 for (let [key, value] of Object.entries(c)) {
   const fakeColor = scope ? hashValue(scope + key) : hashValue(key);
  //  if (key === 'foreground' || key === 'background') {
   a[key] = '#' + fakeColor;
  //  }
 }
 console.log(c);
 return a;
}
function* getCssVariables(c: IRawThemeSetting['settings'], scope?: string | string[] ) {
  for (let [key, value] of Object.entries(c)) {
    const fakeColor = scope ? hashValue(scope + key) : hashValue(key);
    // yield `--shiki-${scope ? hashValue(scope).replace(/[\.|\s]/g, '-') + '-' : ''}${key.replace(/[\.|\s]/g, '-')}: ${value};`
    yield ['#' + fakeColor, `--shiki-${scope ? hashValue(scope).replace(/[\.|\s]/g, '-') + '-' : ''}${key.replace(/[\.|\s]/g, '-')}: ${value};`, `var(--shiki-${scope ? hashValue(scope).replace(/[\.|\s]/g, '-') + '-' : ''}${key.replace(/[\.|\s]/g, '-')})`] as const;
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