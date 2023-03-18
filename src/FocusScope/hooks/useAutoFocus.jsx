import { useEffect } from "react";
import { focusFirstInScope, isElementInScope } from "../utils";

/**
 * Whether to auto focus the first focusable element in the focus scope on mount
 */
function useAutoFocus(scopeRef, autoFocus) {
  useEffect(() => {
    if (autoFocus) {
      window.activeScope = scopeRef;
      if (
        !isElementInScope(document.activeElement, window.activeScope.current)
      ) {
        focusFirstInScope(scopeRef.current);
      }
    }
  }, [scopeRef, autoFocus]);
}

export default useAutoFocus;
