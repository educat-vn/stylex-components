export function isLinkNode(node: Element) {
    while (node != null) {
        if (node.tagName === "A" && (node as HTMLLinkElement).href != null) {
            return true;
        }

        node = node.parentNode as Element;
    }

    return false;
}