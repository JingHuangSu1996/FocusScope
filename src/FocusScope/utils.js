import { focusableElements } from "./const";
import getFocusableTreeWalker from "./dom/getFocusableTreeWalker";

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
  let sentinel = scope[0].previousElementSibling;
  let walker = getFocusableTreeWalker(
    getScopeRoot(scope),
    { tabbable: true },
    scope
  );
  walker.currentNode = sentinel;
  focusElement(walker.nextNode());
}

export function isElementInScope(element, scope) {
  return scope.some((node) => node.contains(element));
}

function isStyleVisible(element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    return false;
  }

  let { display, visibility } = element.style;

  let isVisible =
    display !== "none" && visibility !== "hidden" && visibility !== "collapse";

  if (isVisible) {
    const { getComputedStyle } = element.ownerDocument.defaultView;
    let { display: computedDisplay, visibility: computedVisibility } =
      getComputedStyle(element);

    isVisible =
      computedDisplay !== "none" &&
      computedVisibility !== "hidden" &&
      computedVisibility !== "collapse";
  }

  return isVisible;
}

function isAttributeVisible(element, childElement) {
  return (
    !element.hasAttribute("hidden") &&
    (element.nodeName === "DETAILS" &&
    childElement &&
    childElement.nodeName !== "SUMMARY"
      ? element.hasAttribute("open")
      : true)
  );
}

/**
 * Adapted from https://github.com/testing-library/jest-dom and
 * https://github.com/vuejs/vue-test-utils-next/.
 * Licensed under the MIT License.
 * @param element - Element to evaluate for display or visibility.
 */
export function isElementVisible(element, childElement) {
  return (
    element.nodeName !== "#comment" &&
    isStyleVisible(element) &&
    isAttributeVisible(element, childElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  );
}

export function getScopeRoot(scope) {
  return scope[0].parentElement;
}

function isElementInAnyScope(element, scopes) {
  for (let scope of scopes.values()) {
    if (isElementInScope(element, scope.current)) {
      return true;
    }
  }
  return false;
}
