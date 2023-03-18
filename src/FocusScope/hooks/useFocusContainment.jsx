import React, { useRef, useEffect } from "react";
import {
  focusElement,
  getFocusElementsInScope,
  isElementInScope,
} from "../utils";

/**
 * Whether to contain focus inside the scope, so users cannot move focus outside
 */
function useFocusContainment(scopeRef, contain) {
  let focusedNode = useRef();

  useEffect(() => {
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

      let elements = getFocusElementsInScope(scopeRef.current, {
        tabbable: true,
      });
      let position = elements.indexOf(focusedElement);
      let lastPosition = elements.length - 1;
      let nextElement = null;

      if (e.shiftKey) {
        if (position === 0) {
          nextElement = elements[lastPosition];
        } else {
          nextElement = elements[position - 1];
        }
      } else {
        if (position === lastPosition) {
          nextElement = elements[0];
        } else {
          nextElement = elements[position + 1];
        }
      }
      e.preventDefault();

      if (nextElement) {
        focusElement(nextElement);
      }
    };

    let onFocus = (e) => {
      // If the focused elment is in the current scope, and not in the active scope,
      // update the active scope to point to this scope
      console.log(e, scopeRef.current);
      let isInScope = isElementInScope(e.target, scopeRef.current);
      if (
        isInScope &&
        (!window.activeScope ||
          !isElementInScope(e.target, window.activeScope.current))
      ) {
        activeScope = scopeRef;
      }
      // Save the currently focused node in this scope
      if (isInScope) {
        focusedNode.current = e.target;
      }

      if (activeScope === scopeRef && !isInScope) {
        if (focusedNode.current) {
          focusedNode.current.focus();
        } else {
          focusFirstInScope(scopeRef.current);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("focusin", onFocus, false);
    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("focusin", onFocus, false);
    };
  }, [scopeRef, contain]);
}

export default useFocusContainment;
