import { useRef, useEffect } from "react";
import getFocusableTreeWalker from "../dom/getFocusableTreeWalker";
import { scopes } from "../FocusScope";
import {
  focusElement,
  focusFirstInScope,
  getScopeRoot,
  isElementInScope,
} from "../utils";

/**
 * Whether to contain focus inside the scope, so users cannot move focus outside
 */
function useFocusContainment(scopeRef, contain) {
  let focusedNode = useRef();
  let raf = useRef(null);

  useEffect(() => {
    let scope = scopeRef.current;
    if (!contain) {
      return;
    }

    let onKeyDown = (e) => {
      if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }

      let focusedElement = document.activeElement;

      if (!isElementInScope(focusedElement, scopeRef.current)) {
        return;
      }

      let walker = getFocusableTreeWalker(
        getScopeRoot(scope),
        {
          tabbable: true,
        },
        scope
      );

      walker.currentNode = focusedElement;
      let nextElement = e.shiftKey ? walker.previousNode : walker.nextNode;
      if (!nextElement) {
        walker.currentNode = e.shiftKey
          ? scope[scope.length - 1].nextElementSibling
          : scope[0].previousElementSibling;

        nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
      }

      e.preventDefault();

      if (nextElement) {
        focusElement(nextElement);
      }
    };

    let onFocus = (e) => {
      // If the focused elment is in the current scope, and not in the active scope,
      // update the active scope to point to this scope
      let isInScope = isElementInScope(e.target, scopeRef.current);

      if (!isInScope) {
        if (focusedNode.current) {
          focusedNode.current.focus();
        } else if (window.activeScope) {
          focusFirstInScope(activeScope.current);
        }
      } else {
        activeScope = scopeRef;
        focusedNode.current = e.target;
      }
    };

    let onBlur = (e) => {
      raf.current = requestAnimationFrame(() => {
        let isInScope = isElementInScope(document.activeElement, scopes);

        if (!isInScope) {
          activeScope = scopeRef;
          focusedNode.current = e.target;
          focusedNode.current.focus();
        }
      });
    };

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("focusin", onFocus, false);
    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("focusin", onFocus, false);
    };
  }, [scopeRef, contain]);
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, [raf]);
}

export default useFocusContainment;
