import {useState} from 'react';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
    circle: {
        borderTopLeftRadius: "999px",
        borderTopRightRadius: "999px",
        borderBottomRightRadius: "999px",
        borderBottomLeftRadius: "999px",
    },
    defaultHoveredStyle: {
        backgroundColor: "var(--hover-overlay)",
    },
    defaultPressedStyle: {
        backgroundColor: "var(--press-overlay)",
    },
    focusRing: {
        boxShadow: "var(--focus-ring-shadow-default)",
        outline: "none",
    },
    focusRingInset: {
        boxShadow: "var(--focus-ring-shadow-inset)",
    },
    overlay: {
        bottom: '0',
        right: '0',
        left: '0',
        opacity: '0',
        pointerEvents: "none",
        position: "absolute",
        top: '0',
        transitionDuration: "var(--fds-duration-extra-extra-short-out)",
        transitionProperty: "opacity",
        transitionTimingFunction: "var(--fds-animation-fade-out)",
    },
    overlayVisible: {
        opacity: '1',
        transitionDuration: "0s",
    },
    overlayWeb: {
        borderTopLeftRadius: "inherit",
        borderTopRightRadius: "inherit",
        borderBottomRightRadius: "inherit",
        borderBottomLeftRadius: "inherit",
    }
})

interface Offset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

interface Props {
    focusRingPosition?: string;
    focusVisible?: boolean;
    xstyle?: any;
    focusVisibleStyle?: boolean;
    hovered?: boolean;
    hoveredStyle?: Record<string, any>;
    offset?: number | Offset;
    pressed?: boolean;
    pressedStyle?: Record<string, any>;
    radius?: number | string;
    showFocusRing?: boolean;
}

export const CometPressableOverlayContainer = (props: Props & Record<string, any>) => {
    const {
        children,
        role,
        style,
        xstyle,
        ...rest
    } = props;

    return (
        <div role={role} className={stylex(xstyle)} style={style} {...rest}>
            {children}
        </div>
    )
}

export const PressableOverlay = (props: Props) => {
    const {
        focusRingPosition = 'default',
        focusVisible = false,
        xstyle,
        focusVisibleStyle,
        hovered = false,
        hoveredStyle = styles.defaultHoveredStyle,
        offset,
        pressed = false,
        pressedStyle = styles.defaultPressedStyle,
        radius,
        showFocusRing = false
    } = props;

    const [pressState, setPressState] = useState<string>();

    if (pressed) {
        if (pressState !== "pressed") {
            setPressState("pressed");
        }
    } else if (focusVisible) {
        if (pressState !== "focused") {
            setPressState("focused");
        }
    } else if (hovered) {
        if (pressState !== "hovered") {
            setPressState("hovered");
        }
    }

    let bottom, left, top, right;

    if (offset != null) {
        if ((typeof offset === "number")) {
            bottom = -offset;
            left = -offset;
            top = -offset;
            right = -offset;
        } else {
            bottom = -offset.bottom;
            left = -offset.left;
            top = -offset.top;
            right = -offset.right;
        }
    }

    let focusRingStyle = undefined;

    if ((pressState === "focused" || (pressState === "pressed" && focusVisible)) && showFocusRing) {
        if (focusRingPosition === "default") {
            focusRingStyle = styles.focusRing;
        } else {
            focusRingStyle = styles.focusRingInset;
        }
    }

    let _xstyle = [];

    if (pressed || focusVisible || hovered) {
        _xstyle.push(styles.overlayVisible);

        if (pressState === "pressed") {
            _xstyle.push(pressedStyle);
        } else if (pressState === "focused") {
            _xstyle.push(focusVisibleStyle != null ? focusVisibleStyle : hoveredStyle);
        } else if (pressState === "hovered") {
            _xstyle.push(hoveredStyle);
        }
    }

    _xstyle.push(focusRingStyle);

    if (radius === "50%") {
        _xstyle.push(styles.circle);
    }

    return (
        <CometPressableOverlayContainer
            {...Object.assign({style: pressState && Object.assign({}, typeof radius === "number" ? {
                        borderRadius: radius
                    } : {}, {
                        bottom,
                        left,
                        right,
                        top
                    }), xstyle: [
                        styles.overlay, styles.overlayWeb,
                        xstyle, _xstyle]},
                {
                    role: "none",
                }
            )}
        />
    )
}

