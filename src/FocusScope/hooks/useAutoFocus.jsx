import { useEffect } from "react";
import { focusFirstInScope, isElementInScope } from "../utils";

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
