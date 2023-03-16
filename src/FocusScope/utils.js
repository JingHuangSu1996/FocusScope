import { focusableElements } from "./const";

export const FOCUSABLE_ELEMENT_SELECTOR =
  focusableElements.join(",") + ",[tabindex]";

focusableElements.push('[tabindex]:not([tabindex="-1"])');

export const TABBABLE_ELEMENT_SELECTOR = focusableElements.join(
  ':not([tabindex="-1"]),'
);

export function getFocusElementsInScope(scope, opts) {
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

export function focusElement(element) {
  if (element != null) {
    try {
      element.focus();
    } catch (err) {
      // ignore
    }
  }
}

export function focusFirstInScope(scope) {
  let elements = getFocusElementsInScope(scope, { tabbable: true });
  focusElement(elements[0]);
}

export function isElementInScope(element, scope) {
  return scope.some((node) => node.contains(element));
}
