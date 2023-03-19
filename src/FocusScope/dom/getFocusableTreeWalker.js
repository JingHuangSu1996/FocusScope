import {
  TABBABLE_ELEMENT_SELECTOR,
  FOCUSABLE_ELEMENT_SELECTOR,
  isElementInScope,
  isElementVisible,
} from "../utils.js";

function getFocusableTreeWalker(root, opts, scope) {
  let selector = opts.tabbable
    ? TABBABLE_ELEMENT_SELECTOR
    : FOCUSABLE_ELEMENT_SELECTOR;

  let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMNT, {
    acceptNode(node) {
      // Skip nodes inside the starting node
      if (opts?.from?.contains(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      if (
        isElementVisible(node) &&
        node.matches(selector) &&
        (!scope || isElementInScope(node, scope))
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });

  if (opts?.from) {
    walker.currentNode = opts.from;
  }

  return walker;
}

export default getFocusableTreeWalker;
