import { useLayoutEffect } from "react";
import { focusElement } from "../utils";

/**
 * Whether to restore focus back to the element that was focused when the focus scope mounted,
 * after the focus scope unmounts.
 */
function useRestoreFocus(restoreFocus) {
  useLayoutEffect(() => {
    let nodeToRestore = document.activeElement;

    return () => {
      if (restoreFocus && nodeToRestore) {
        requestAnimationFrame(() => {
          if (document.body.contains(nodeToRestore)) {
            focusElement(nodeToRestore);
          }
        });
      }
    };
  }, [restoreFocus]);
}

export default useRestoreFocus;
