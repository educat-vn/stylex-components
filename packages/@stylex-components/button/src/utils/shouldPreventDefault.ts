import React from "react";
import {hasNode} from "./hasNode";
import {isLinkNode} from "./isLinkNode";

export function shouldPreventDefault(event: React.MouseEvent<HTMLElement>, preventDefault: boolean) {
    const {
        altKey,
        ctrlKey,
        currentTarget,
        metaKey,
        shiftKey
    } = event;

    const {target} = event;
    let node = hasNode(target as Element) ? target as Element : currentTarget;
    let isLink = isLinkNode(node);
    let hasMetaKey = altKey || ctrlKey || metaKey || shiftKey;

    return preventDefault !== false && isLink && !hasMetaKey;
}