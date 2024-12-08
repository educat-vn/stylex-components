export function hasNode(node: Element) {
    return typeof document !== "undefined" &&
    typeof document.contains === "function"
        ? document.contains(node)
        : false;
}