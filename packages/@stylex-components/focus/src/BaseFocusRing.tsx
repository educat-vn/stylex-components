import React, {ReactElement} from 'react';
import {FocusWithinProps} from '@react-aria/interactions';
import {mergeProps} from '@react-aria/utils';
import stylex from '@stylexjs/stylex';

import {FocusWithinHandler} from './FocusWithinHandler';

const styles = stylex.create({
    focused: { boxShadow: 'var(--focus-ring-shadow-default)' },
    focusedInset: { boxShadow: 'var(--focus-ring-shadow-inset)' },
    unfocused: { outline: 'none' }
})

export interface FocusRingProps {
    children: Function | ReactElement,
    isTextInput?: boolean,
    autoFocus?: boolean,
    focusRingPosition?: 'default' | 'inset',
    suppressFocusRing?: boolean;
}

export function BaseFocusRing(props: FocusRingProps) {
    let {children, focusRingPosition = 'default', suppressFocusRing} = props;
    let child = typeof children === 'function' ? null : React.Children.only(children);

    return (
        <FocusWithinHandler>
            {(focusWithinProps: FocusWithinProps, isFocusWithin: boolean) => {
                let xstyle: any = styles.unfocused;

                if (isFocusWithin && !suppressFocusRing) {
                    xstyle = focusRingPosition === "inset" ? styles.focusedInset : styles.focused;
                }

                return typeof children === 'function' ? children(focusWithinProps, xstyle) : React.cloneElement((child as unknown as ReactElement), mergeProps((child as unknown as ReactElement).props as any, {
                    ...focusWithinProps,
                    className: stylex(xstyle),
                }));
            }}
        </FocusWithinHandler>
    )
}