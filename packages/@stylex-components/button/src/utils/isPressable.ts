import React from "react";

export const isPressable = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    let tagName = target.tagName;

    let focusable =
        target.isContentEditable ||
        (tagName === "A" && (target as HTMLLinkElement).href != null) ||
        tagName === "BUTTON" ||
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA";

    if (target.tabIndex === 0 && !focusable) {
        const {key} = event;

        if (key === "Enter") return true;

        let role = target.getAttribute("role");
        if (
            (key === " " || key === "Spacebar") &&
            (role === "button" ||
                role === "checkbox" ||
                role === "combobox" ||
                role === "menuitem" ||
                role === "menuitemcheckbox" ||
                role === "menuitemradio" ||
                role === "option" ||
                role === "radio" ||
                role === "switch" ||
                role === "tab")
        )
            return true;
    }

    return false;
};