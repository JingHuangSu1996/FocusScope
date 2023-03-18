import React, { useRef, useEffect, useContext } from "react";
import useAutoFocus from "./hooks/useAutoFocus";
import useFocusContainment from "./hooks/useFocusContainment";
import useRestoreFocus from "./hooks/useRestoreFocus";

import { getFocusElementsInScope } from "./utils";

const FocusContext = React.createContext(null);

export function useFocusManager() {
  return useContext(FocusContext);
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
    },
  };
}

export function FocusScope({ children, restore, contain, autoFocus = true }) {
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

  useRestoreFocus(restore);
  useAutoFocus(scopeRef, autoFocus);
  useFocusContainment(scopeRef, contain);

  let focusManager = createFocusManger(scopeRef);

  return (
    <FocusContext.Provider value={focusManager}>
      <span hidden ref={startRef} />
      {children}
      <span hidden ref={endRef} />
    </FocusContext.Provider>
  );
}
