import {ReactElement, useRef} from 'react';
import { useButton, AriaButtonProps } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import stylex from '@stylexjs/stylex';

import {PressableOverlay} from './PressableOverlay';

const styles = stylex.create({
    root: {
        position: 'relative',
        color: 'red',
    },
    disabled: {
        color: 'black'
    }
})

interface Props {
    overlayDisabled?: boolean;
    disabled?: boolean;
    children?: ReactElement;
    overlayFocusRingPosition?: string;
    hideFocusOverlay?: boolean;
    hideHoverOverlay?: boolean;
    overlayFocusVisibleStyle?: any;
    overlayPressedStyle?: any;
    overlayRadius?: number;
    overlayOffset?: number;
    overlayHoveredStyle?: any;
}

export const Button = (props: Props & AriaButtonProps) => {
    const {
        overlayDisabled,
        overlayFocusRingPosition,
        hideFocusOverlay = false,
        hideHoverOverlay = false,
        overlayFocusVisibleStyle,
        overlayPressedStyle,
        overlayRadius,
        overlayOffset,
        overlayHoveredStyle
    } = props;

    let ref = useRef<Element>(null);
    let { buttonProps, isPressed } = useButton(props, ref);

    let { focusProps, isFocusVisible } = useFocusRing();

    let { hoverProps, isHovered } = useHover({
        onHoverStart: (e) => console.log(`hover start with ${e.pointerType}`),
        onHoverEnd: (e) => console.log(`hover end with ${e.pointerType}`)
    });

    return (
        <div {...mergeProps(focusProps, buttonProps, hoverProps)} className={stylex([styles.root, props.disabled && styles.disabled])}>
            {props.children}
            {!overlayDisabled && (
                <PressableOverlay
                    focusRingPosition={overlayFocusRingPosition}
                    focusVisible={!hideFocusOverlay && isFocusVisible}
                    focusVisibleStyle={overlayFocusVisibleStyle}
                    hovered={!hideHoverOverlay && isHovered}
                    hoveredStyle={overlayHoveredStyle}
                    pressed={isPressed}
                    pressedStyle={overlayPressedStyle}
                    radius={overlayRadius}
                    offset={overlayOffset}
                    showFocusRing={true}
                />
            )}
        </div>
    )
}