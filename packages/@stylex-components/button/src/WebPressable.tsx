import React, {useRef, useCallback, useContext, useState} from "react";
import stylex from "@stylexjs/stylex";
import {useHover, useFocus, usePress, useFocusVisible} from '@react-aria/interactions';
import {mergeProps} from '@react-aria/utils';

import {WebPressableGroupContext} from "@stylex-components/context";
import {joinClasses} from "@stylex-components/utils";
import {isPressable, shouldPreventDefault} from './utils';
import {Link} from './types';
import {useWebPressableTouchStartHandler} from "./useWebPressableTouchStartHandler";

const styles = stylex.create({
    disabled: {
        cursor: "not-allowed",
    },
    focusNotVisible: {
        outlineStyle: "none",
    },
    root: {
        WebkitTapHighlightColor: "transparent",
        alignItems: "stretch",
        backgroundColor: "transparent",
        borderTopColor: "var(--always-dark-overlay)",
        borderRightColor: "var(--always-dark-overlay)",
        borderBottomColor: "var(--always-dark-overlay)",
        borderLeftColor: "var(--always-dark-overlay)",
        borderTopStyle: "solid",
        borderRightStyle: "solid",
        borderBottomStyle: "solid",
        borderLeftStyle: "solid",
        borderTopWidth: '0',
        borderRightWidth: '0',
        borderBottomWidth: '0',
        borderLeftWidth: '0',
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        flexBasis: "auto",
        flexDirection: "column",
        flexShrink: '0',
        listStyle: "none",
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        minHeight: '0',
        minWidth: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        position: "relative",
        textAlign: "inherit",
        textDecoration: "none",
        touchAction: "manipulation",
        zIndex: '0',
    },
    rootInGroup: {
        touchAction: "none",
    },
});

const TAG_NAMES: Record<string, string> = {
    article: "article",
    banner: "header",
    complementary: "aside",
    contentinfo: "footer",
    figure: "figure",
    form: "form",
    heading: "h1",
    label: "label",
    link: "a",
    list: "ul",
    listitem: "li",
    main: "main",
    navigation: "nav",
    none: "div",
    region: "section",
};

function getComponentTag(accessibilityRole: string, link: Link) {
    let tag = "div";
    if (["menuitem", "tab", "none"].includes(accessibilityRole) && link?.url) {
        tag = "a";
    } else if (accessibilityRole) {
        let _tag = TAG_NAMES[accessibilityRole];
        if (_tag) {
            tag = _tag;
        }
    }

    return tag;
}

function getRole(accessibilityRole?: string) {
    switch (accessibilityRole) {
        case "none":
            return "presentation";
        case "label":
            return undefined;
        default:
            return accessibilityRole;
    }
}

export const WebPressable = (props) => {
    let pressableRef = useRef<HTMLElement | null>(null);

    let PressableGroup = useContext(WebPressableGroupContext);

    let {
        accessibilityLabel,
        accessibilityRelationship,
        accessibilityRole,
        accessibilityState,
        accessibilityValue,
        allowClickEventPropagation = false,
        children,
        className_DEPRECATED,
        disabled,
        forwardedRef,
        link,
        nativeID,
        onBlur,
        onContextMenu,
        onFocus,
        onFocusChange,
        onFocusVisibleChange,
        onHoverChange,
        onHoverEnd,
        onHoverMove,
        onHoverStart,
        onKeyDown,
        onPress,
        onPressChange,
        onPressEnd,
        onPressMove,
        onPressStart,
        preventContextMenu,
        preventDefault,
        style,
        suppressFocusRing = false,
        tabbable,
        testID,
        testOnly_state,
        xstyle,
        ...rest
    } = props;

    disabled = disabled === true || (accessibilityState == null ? undefined : accessibilityState.disabled) === true;

    let [focused, setFocused] = useState(false);
    const {isFocusVisible: focusVisible} = useFocusVisible();

    const {isPressed: pressed, pressProps} = usePress({
        isDisabled: disabled,
        onPressChange: (pressed) => {
            if (typeof onPressChange === 'function') {
                onPressChange(pressed);
            }
        },
        onPressEnd,
        // onPressMove, // TODO: maybe implement this
        onPressStart,
    });

    const {isHovered: hovered, hoverProps} = useHover({
        isDisabled: disabled,
        onHoverChange: (hovered) => {
            if (typeof onHoverChange === 'function') {
                onHoverChange(hovered);
            }
        },
        onHoverEnd,
        // onHoverMove, // TODO: maybe implement this
        onHoverStart,
    });

    const Component = getComponentTag(accessibilityRole, link);

    const hidden = accessibilityState == null ? undefined : accessibilityState.hidden;

    const allowLink = Component === "a" && disabled !== true;

    let i = {
        disabled:
            disabled === true ||
            (testOnly_state == null ? undefined : testOnly_state.disabled) === true ||
            false,
        focusVisible:
            focusVisible ||
            (testOnly_state == null ? undefined : testOnly_state.focusVisible) ===
            true,
        focused:
            focused ||
            (testOnly_state == null ? undefined : testOnly_state.focused) === true,
        hovered:
            hovered ||
            (testOnly_state == null ? undefined : testOnly_state.hovered) === true,
        pressed:
            pressed ||
            (testOnly_state == null ? undefined : testOnly_state.pressed) === true,
    };

    let _children = typeof children === "function" ? children(i) : children;

    let _className =
        typeof className_DEPRECATED === "function"
            ? className_DEPRECATED(i)
            : className_DEPRECATED;

    let _style = typeof style === "function" ? style(i) : style;
    let _xstyle = typeof xstyle === "function" ? xstyle(i) : xstyle;

    const {focusProps} = useFocus({
        isDisabled: disabled,
        onFocus,
        onBlur,
        onFocusChange: (focused) => {
            setFocused(focused);
            if (typeof onFocusChange === 'function') {
                onFocusChange(focused);
            }
        },
    })

    // WebPressability.usePressability(pressableRef, {
    //     disabled,
    //     onBlur,
    //     onContextMenu,
    //     onFocus,
    //     onFocusChange: handleChange(setFocused, onFocusChange),
    //     onFocusVisibleChange: handleChange(setFocusVisible, onFocusVisibleChange),
    //     onHoverChange: handleChange(setHovered, onHoverChange),
    //     onHoverEnd,
    //     onHoverMove,
    //     onHoverStart,
    //     onPressChange: handleChange(setPressed, onPressChange),
    //     onPressEnd,
    //     onPressMove,
    //     onPressStart,
    //     preventContextMenu,
    //     preventDefault: preventDefault == null ? true : preventDefault,
    // });

    let handleClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            if (onPress) {
                onPress(event)
            }

            if ((onPress || link != null) && allowClickEventPropagation !== true) {
                event.stopPropagation()
            }

            if (shouldPreventDefault(event, preventDefault)) {
                event.nativeEvent.preventDefault();
            }
        },
        [link, onPress, preventDefault]
    );

    let handleKey = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            if (onKeyDown) {
                onKeyDown(event);
            }

            if (isPressable(event)) {
                const {key} = event;
                if (key === " " || key === "Spacebar") {
                    event.preventDefault();
                }

                if (onPress) {
                    onPress(event);
                    event.stopPropagation()
                }
            }
        },
        [onKeyDown, onPress]
    );

    let handleRef = useCallback(
        (ref: HTMLElement) => {
            pressableRef.current = ref;

            if (typeof forwardedRef === "function") {
                forwardedRef(ref)
            } else if (forwardedRef != null) {
                forwardedRef.current = ref
            }
        },
        [forwardedRef]
    );

    useWebPressableTouchStartHandler(pressableRef, PressableGroup, handleClick);

    let tabIndex = -1;

    if (disabled !== true && hidden !== true && tabbable !== false) {
        tabIndex = 0
    }

    let download = link == null ? undefined : link.download;
    let canDownload = (download === true || typeof download === "string") && allowLink;

    return (
        <Component
            {...mergeProps(hoverProps, focusProps, pressProps)}
            {...Object.assign(rest, {
                "aria-activedescendant":
                    accessibilityRelationship &&
                    accessibilityRelationship.activedescendant,
                "aria-busy": accessibilityState && accessibilityState.busy,
                "aria-checked": accessibilityState && accessibilityState.checked,
                "aria-controls":
                    accessibilityRelationship && accessibilityRelationship.controls,
                "aria-current":
                    accessibilityRelationship && accessibilityRelationship.current,
                "aria-describedby":
                    accessibilityRelationship && accessibilityRelationship.describedby,
                "aria-details":
                    accessibilityRelationship && accessibilityRelationship.details,
                "aria-disabled":
                    disabled === true && accessibilityRole !== "none"
                        ? disabled
                        : undefined,
                "aria-errormessage":
                    accessibilityRelationship && accessibilityRelationship.errormessage,
                "aria-expanded": accessibilityState && accessibilityState.expanded,
                "aria-haspopup":
                    accessibilityRelationship && accessibilityRelationship.haspopup,
                "aria-hidden": hidden,
                "aria-invalid": accessibilityState && accessibilityState.invalid,
                "aria-label": accessibilityLabel,
                "aria-labelledby":
                    accessibilityRelationship && accessibilityRelationship.labelledby,
                "aria-modal": accessibilityState && accessibilityState.modal,
                "aria-orientation":
                    accessibilityState && accessibilityState.orientation,
                "aria-owns":
                    accessibilityRelationship && accessibilityRelationship.owns,
                "aria-pressed": accessibilityState && accessibilityState.pressed,
                "aria-readonly": accessibilityState && accessibilityState.readonly,
                "aria-required": accessibilityState && accessibilityState.required,
                "aria-selected": accessibilityState && accessibilityState.selected,
                "aria-valuemax": accessibilityValue && accessibilityValue.max,
                "aria-valuemin": accessibilityValue && accessibilityValue.min,
                "aria-valuenow": accessibilityValue && accessibilityValue.now,
                "aria-valuetext": accessibilityValue && accessibilityValue.text,
                attributionsrc: allowLink
                    ? link == null
                        ? undefined
                        : link.attributionsrc
                    : undefined,
                children: _children,
                className: joinClasses(
                    stylex(
                        styles.root,
                        i.disabled && styles.disabled,
                        (!i.focusVisible || suppressFocusRing === true) &&
                        styles.focusNotVisible,
                        _xstyle,
                        PressableGroup && styles.rootInGroup
                    ),
                    _className
                ),
                "data-testid": undefined,
                download: canDownload ? download : undefined,
                href: allowLink ? (link == null ? undefined : link.url) : undefined,
                id: nativeID,
                onClick: disabled ? undefined : handleClick,
                onKeyDown: disabled ? undefined : handleKey,
                ref: handleRef,
                rel: allowLink ? (link == null ? undefined : link.rel) : undefined,
                role: getRole(accessibilityRole),
                style: _style,
                tabIndex: tabIndex,
                target: allowLink
                    ? link == null
                        ? undefined
                        : link.target
                    : undefined,
            })}
        />
    );
};
