import React, { useRef, useEffect, useContext } from "react";
import getFocusableTreeWalker from "./dom/getFocusableTreeWalker";
import useAutoFocus from "./hooks/useAutoFocus";
import useFocusContainment from "./hooks/useFocusContainment";
import useRestoreFocus from "./hooks/useRestoreFocus";

import { focusElement, getScopeRoot, isElementInScope } from "./utils";

const FocusContext = React.createContext(null);
export let scopes = new Set();

export function useFocusManager() {
  return useContext(FocusContext);
}

export function createFocusMangerForScope(scopeRef) {
  return {
    focusNext: (opts) => {
      let scope = scopeRef.current;
      let { from, tabbable, wrap } = opts;
      let node = from || document.activeElement;
      let sentinel = scope[0].previousElementSibling;
      let walker = getFocusableTreeWalker(
        getScopeRoot(scope),
        { tabbable },
        scope
      );

      walker.currentNode = isElementInScope(node, scope) ? node : sentinel;

      let nextNode = walker.nextNode();

      if (!nextNode && wrap) {
        walker.currentNode = sentinel;
        nextNode = walker.nextNode();
      }
      if (nextNode) {
        focusElement(nextNode, true);
      }
      return nextNode;
    },
    focusPrevious: (opts) => {
      let scope = scopeRef.current;
      let { from, tabbable, wrap } = opts;
      let node = from || document.activeElement;
      let sentinel = scope[scope.length - 1].nextElementSibling;
      let walker = getFocusableTreeWalker(
        getScopeRoot(scope),
        { tabbable },
        scope
      );
      walker.currentNode = isElementInScope(node, scope) ? node : sentinel;

      let previousNode = walker.previousNode();

      if (!previousNode && wrap) {
        walker.currentNode = sentinel;
        previousNode = walker.previousNode();
      }
      if (previousNode) {
        focusElement(previousNode, true);
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
    scopes.add(scopeRef);
    return () => {
      scopes.delete(scopeRef);
    };
  }, [children]);

  useRestoreFocus(restore);
  useAutoFocus(scopeRef, autoFocus);
  useFocusContainment(scopeRef, contain);

  let focusManager = createFocusMangerForScope(scopeRef);

  return (
    <FocusContext.Provider value={focusManager}>
      <span hidden ref={startRef} />
      {children}
      <span hidden ref={endRef} />
    </FocusContext.Provider>
  );
}
