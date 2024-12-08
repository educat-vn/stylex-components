import React, { useCallback, useContext, useRef, useState } from "react";
import {mergeProps, mergeRefs} from '@react-aria/utils';
import {useHover, useFocus, usePress, useFocusVisible} from '@react-aria/interactions';
import stylex from "@stylexjs/stylex";

import { PressableGroupContext } from "@stylex-components/context";
import { joinClasses } from "@stylex-components/utils";
import {Link} from './types';
import {isPressable, shouldPreventDefault} from './utils';
import {useWebPressableTouchStartHandler} from './useWebPressableTouchStartHandler';

const styles = stylex.create({
    disabled: {
        cursor: "not-allowed",
    },
    focusNotVisible: {
        outline: "none",
    },
    linkFocusRing: {
        outline: "var(--focus-ring-outline-link)",
    },
    notSelectable: {
        userSelect: "none",
    },
    root: {
        WebkitTapHighlightColor: "transparent",
        backgroundColor: "transparent",
        borderTop: 0,
        borderRight: 0,
        borderBottom: 0,
        borderLeft: 0,
        boxSizing: "border-box",
        cursor: "pointer",
        display: "inline",
        listStyle: "none",
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        textAlign: "inherit",
        textDecoration: "none",
        touchAction: "manipulation",
    },
    rootInGroup: {
        touchAction: "none",
    },
});

const DEFAULT_TAGS: Record<string, string> = {
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

const getLinkTag = (accessibilityRole: string, link: Link) => {
    var tag = "div";
    if (
        link?.url !== "#" ||
        (["menuitem", "tab", "none"].includes(accessibilityRole) && link?.url)
    ) {
        tag = "a";
    } else if (accessibilityRole) {
        if (DEFAULT_TAGS[accessibilityRole]) {
            tag = DEFAULT_TAGS[accessibilityRole];
        }
    }

    return tag;
};

export const PressableText = (props: any) => {
    let {
        accessibilityLabel,
        accessibilityRelationship,
        accessibilityRole,
        accessibilityState,
        children,
        className_DEPRECATED,
        direction,
        disabled,
        focusable,
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
        onPress,
        onPressChange,
        onPressEnd,
        onPressMove,
        onPressStart,
        preventContextMenu,
        preventDefault = true,
        selectable,
        style,
        suppressFocusRing,
        testID,
        testOnly_state,
        xstyle,
        ...rest
    } = props;

    disabled = disabled || accessibilityRole?.disabled;

    const ref = useRef(null);
    const [focused, setFocused] = useState(false);

    // Pressability.usePressability(ref, {
    //     disabled,
    //     onBlur,
    //     onContextMenu,
    //     onFocus,
    //     onFocusChange: handleChangeValue(setFocused, onFocusChange),
    //     onFocusVisibleChange: handleChangeValue(
    //         setFocusVisible,
    //         onFocusVisibleChange
    //     ),
    //     onHoverChange: handleChangeValue(setHovered, onHoverChange),
    //     onHoverEnd,
    //     onHoverMove,
    //     onHoverStart,
    //     onPressChange: handleChangeValue(setPressed, onPressChange),
    //     onPressEnd,
    //     onPressMove,
    //     onPressStart,
    //     preventContextMenu,
    //     preventDefault,
    // });

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

    const pressableGroupContext = useContext(PressableGroupContext);

    const Component = getLinkTag(accessibilityRole, link);

    const hasLink = Component === "a" && !disabled;

    // TODO: refactor this variable name
    const f = {
        disabled: disabled === true || testOnly_state?.disabled === true || false,
        focused: focused || testOnly_state?.focused === true,
        focusVisible:
            (focusVisible && suppressFocusRing !== true) ||
            testOnly_state?.focusVisible === true,
        hovered: hovered || testOnly_state?.hovered === true,
        pressed: pressed || testOnly_state?.pressed === true,
    };

    const _children = typeof children === "function" ? children(f) : children;
    let _classname =
        typeof className_DEPRECATED === "function"
            ? className_DEPRECATED(f)
            : className_DEPRECATED;
    let _xstyle = typeof xstyle === "function" ? xstyle(f) : xstyle;
    let _style = typeof style === "function" ? style(f) : style;



    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            if (onPress) {
                onPress(event);
            }

            if (onPress || link) {
                event.stopPropagation();
            }

            if (shouldPreventDefault(event, preventDefault)) {
                event.nativeEvent.preventDefault();
            }
        },
        [link, onPress, preventDefault]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            if (isPressable(event)) {
                (event.key === " " || event.key === "Spacebar") &&
                event.preventDefault();
                if (onPress) {
                    onPress(event);
                    event.stopPropagation();
                }
            }
        },
        [onPress]
    );

    let _direction;
    switch (direction) {
        case "none":
            break;
        default:
            if (direction) {
                _direction = direction;
            }
            break;
    }

    const combinedRef = mergeRefs(ref, forwardedRef);

    useWebPressableTouchStartHandler(ref, pressableGroupContext, handleClick);

    const role = accessibilityRole === "none" ? "presentation" : accessibilityRole;

    let pressable = Component === "a" || accessibilityRole === "button";
    let hidden = accessibilityState?.hidden;

    let tabIndex;
    if (pressable) {
        if (hidden === true || focusable === false || disabled === true) {
            tabIndex = -1;
        } else {
            tabIndex = 0;
        }
    } else if (
        disabled !== true &&
        hidden !== true &&
        focusable !== false &&
        accessibilityRole !== "none"
    ) {
        tabIndex = 0;
    }

    let canDownload = (link?.download === true || typeof link?.download === "string") && hasLink;

    return (
        <Component
            {...mergeProps(hoverProps, focusProps, pressProps)}
            {...Object.assign({}, rest, {
                ref: combinedRef,
                "aria-activedescendant": accessibilityRelationship?.activedescendant,
                "aria-busy": accessibilityState?.busy,
                "aria-controls": accessibilityRelationship?.controls,
                "aria-current": accessibilityRelationship?.current,
                "aria-describedby": accessibilityRelationship?.describedby,
                "aria-details": accessibilityRelationship?.details,
                "aria-disabled":
                    disabled === !0 && role !== "presentation" ? disabled : undefined,
                "aria-expanded": accessibilityState?.expanded,
                "aria-haspopup": accessibilityRelationship?.haspopup,
                "aria-hidden": accessibilityState?.hidden,
                "aria-invalid": accessibilityState?.invalid,
                "aria-label": accessibilityLabel,
                "aria-labelledby": accessibilityRelationship?.labelledby,
                "aria-owns": accessibilityRelationship?.owns,
                "aria-pressed": accessibilityState?.pressed,
                "aria-readonly": accessibilityState?.readonly,
                "aria-required": accessibilityState?.required,
                "aria-selected": accessibilityState?.selected,
                attributionsrc: hasLink && link?.attributionsrc,
                children: _children,
                className: joinClasses(
                    stylex(
                        styles.root,
                        selectable === false && styles.notSelectable,
                        f.disabled && styles.disabled,
                        !f.focusVisible && styles.focusNotVisible,
                        f.focusVisible && pressable && styles.linkFocusRing,
                        _xstyle,
                        pressableGroupContext && styles.rootInGroup
                    ),
                    _classname
                ),
                dir: _direction,
                download: canDownload ? link?.download : undefined,
                href: hasLink && link?.url,
                id: nativeID,
                onClick: disabled ? undefined : handleClick,
                onKeyDown: disabled ? undefined : handleKeyDown,
                rel: hasLink && link?.rel,
                role,
                style: _style,
                tabIndex,
                target: hasLink && link?.target,
            })}
        />
    );
};
