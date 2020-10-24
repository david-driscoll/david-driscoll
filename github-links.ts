import { extname } from "path";
import visit from "unist-util-visit";
import { Node, Parent } from "unist";
import { Octokit } from "@octokit/rest";
import { createTokenAuth } from "@octokit/auth-token";

type Match = {
  owner: string;
  repo: string;
  ref: string;
  path: string;
  firstLineIndex: number;
  numOfLines: number;
};

export type GithubData = {
    line: number;
    lineEnd: number;
    owner: string;
    repo: string;
    ref: string;
    path: string;
    url: string;
}

module.exports = function githubPermalinksPlugin({ token = "" } = {}) {
  try {
    const github = new Octokit({
      // authStrategy: createTokenAuth(token),
      auth: token,
    });

    const getSnippet = async ({ owner, repo, ref, path, firstLineIndex, numOfLines }: Match) => {
      try {
        const content = await github.repos.getContent({
          owner,
          repo,
          path,
          ref,
        });
        content.data.type;
        return Buffer.from(content.data.content, "base64")
          .toString()
          .split("\n")
          .slice(firstLineIndex, firstLineIndex + numOfLines)
          .join("\n");
      } catch (e) {
        return `GitHubError: ${e.toString()}`;
      }
    };

    return async function transformer(tree: Node) {
      const promises: Promise<any>[] = [];

      visit(tree, "paragraph", (paragraph, _, parent) => {
        try {
          if (!isParent(paragraph)) return;
          if (!parent) return;
          if (paragraph.children.length !== 1) {
            return;
          }

          const [image] = paragraph.children;

          if (image.type !== "image" || image.alt) {
            return;
          }

          promises.push(
            (async () => {
              try {
                const match = matchPermalink((image as any).url);

                if (match) {
                  parent.children.splice(parent.children.indexOf(paragraph), 1, {
                    type: "code",
                      lang: image.title || extname(match.path).slice(1),
                      github: {
                          url: (image as any).url,
                          line: match.firstLineIndex + 1,
                          lineEnd: match.firstLineIndex + match.numOfLines,
                          owner: match.owner,
                          repo: match.repo,
                          ref: match.ref,
                          path: match.path
                      },
                      line: match.firstLineIndex + 1,


                    value: await getSnippet(match),
                  });
                }
              } catch (e) {
                console.log(e);
                throw e;
              }
            })()
          );
        } catch (e) {
          console.log(e);
          throw e;
        }
      });
      await Promise.all(promises);
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

function isParent(node: Node): node is Parent {
  return !!(node as any).children;
}

function matchPermalink(href: string): Match | null {
  const pattern = /^https:\/\/github.com\/([^/]+)\/([^/]+)\/blob\/((?:[0-9a-f]{40}|master|next|main))\/([^#]+)#L([0-9]+)(-L([0-9]+))?$/;
  const regex = new RegExp(pattern);
  const match = href.match(regex);
  if (!match) return null;
  const [, owner, repo, ref, path, start, , end = start] = match;
  const firstLineIndex = Number(start) - 1;
  const numOfLines = 1 + Number(end) - Number(start);
  return { owner, repo, ref, path, firstLineIndex, numOfLines };
}
