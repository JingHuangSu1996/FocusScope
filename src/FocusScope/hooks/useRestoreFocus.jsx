import { useEffect } from "react";
import { focusElement } from "../utils";

/**
 * Whether to restore focus back to the element that was focused when the focus scope mounted,
 * after the focus scope unmounts.
 */
function useRestoreFocus(restoreFocus) {
  useEffect(() => {
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
