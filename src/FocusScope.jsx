import React, { useRef, useEffect, useContext } from "react";

const FocusContext = React.createContext(null);

export function useFocusManager() {
  return useContext(FocusContext);
}

const focusableElements = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]"
];

export const FOCUSABLE_ELEMENT_SELECTOR =
  focusableElements.join(",") + ",[tabindex]";

focusableElements.push('[tabindex]:not([tabindex="-1"])');
export const TABBABLE_ELEMENT_SELECTOR = focusableElements.join(
  ':not([tabindex="-1"]),'
);

function getFocusElementsInScope(scope, opts) {
  let res = [];
  let selector = opts.tabbable
    ? TABBABLE_ELEMENT_SELECTOR
    : FOCUSABLE_ELEMENT_SELECTOR;
  for (let node of scope) {
    if (node.matches(selector)) {
      res.push(node);
    }
    res.push(...Array.from(node.querySelectorAll(selector)));
  }
  return res;
}

export function createFocusManger(scopeRef) {
  return {
    focusNext: (opts) => {
      let node = opts.from || document.activeElement;
      let focusable = getFocusElementsInScope(scopeRef.current, opts);
      let nextNode = focusable.find(
        (n) =>
          !!(
            node.compareDocumentPosition(n) &
            (Node.DOCUMENT_POSITION_FOLLOWING |
              Node.DOCUMENT_POSITION_CONTAINED_BY)
          )
      );
      if (nextNode) {
        nextNode.focus();
      }
      return nextNode;
    },
    focusPrevious: (opts) => {
      let node = opts.from || document.activeElement;
      let focusable = getFocusElementsInScope(scopeRef.current, opts).reverse();
      let previousNode = focusable.find(
        (n) =>
          !!(
            node.compareDocumentPosition(n) &
            (Node.DOCUMENT_POSITION_PRECEDING |
              Node.DOCUMENT_POSITION_CONTAINED_BY)
          )
      );
      if (previousNode) {
        previousNode.focus();
      }
      return previousNode;
    }
  };
}

export function FocusScope({ children }) {
  let startRef = useRef(null);
  let endRef = useRef(null);
  let scopeRef = useRef([]);

  useEffect(() => {
    let node = startRef.current.nextSibling;
    let nodes = [];

    while (node && node !== endRef.current) {
      nodes.push(node);
      node = node.nextSibling;
    }

    scopeRef.current = nodes;
  }, [children]);

  let focusManager = createFocusManger(scopeRef);

  return (
    <FocusContext.Provider value={focusManager}>
      <span hidden ref={startRef} />
      {children}
      <span hidden ref={endRef} />
    </FocusContext.Provider>
  );
}
