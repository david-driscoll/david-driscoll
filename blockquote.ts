import visit from "unist-util-visit";
import { Node } from "unist";

module.exports = function blockquoteClassName(options = {}) {
  return async function transformer(tree: Node) {
    visit(tree, "blockquote", (blockquote, _, parent) => {
      blockquote.data = blockquote.data ?? {};
      blockquote.data.hProperties = blockquote.data.hProperties ?? ({} as any);
      (blockquote.data.hProperties as any).className = (blockquote.data.hProperties as any).className ?? "";
        (blockquote.data.hProperties as any).className += " blockquote";
        (blockquote.data.hProperties as any).className = (blockquote.data.hProperties as any).className.trim();
    });
  };
};
