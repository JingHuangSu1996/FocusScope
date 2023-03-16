import { useEffect } from "react";
import { focusElement } from "../utils";

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
