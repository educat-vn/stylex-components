import {ReactElement, useCallback, useId, useRef, useState} from 'react';
import stylex from '@stylexjs/stylex';
import {FocusWithinProps} from '@react-aria/interactions';
import {mergeProps} from '@react-aria/utils';

import {BaseFocusRing, FocusWithinHandler} from '@stylex-components/focus';

const isEmptyValue = (value: any) => {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else if (typeof value === "object") {
        if (value) {
            for (let _ in value) {
                return false;
            }
        }

        return true
    }

    return value == null || value === ""
}

const shake = stylex.keyframes({
    '10%': {
        transform: 'translate3d(-1px,0,0)'
    },
    '20%': {
        transform: 'translate3d(2px,0,0)'
    },
    '30%': {
        transform: 'translate3d(-4px,0,0)'
    },
    '40%': {
        transform: 'translate3d(4px,0,0)'
    },
    '50%': {
        transform: 'translate3d(-4px,0,0)'
    },
    '60%': {
        transform: 'translate3d(4px,0,0)'
    },
    '70%': {
        transform: 'translate3d(-4px,0,0)'
    },
    '80%': {
        transform: 'translate3d(2px,0,0)'
    },
    '90%': {
        transform: 'translate3d(-1px,0,0)'
    },
});

const styles = stylex.create({
    disabled: {
        backgroundColor: 'var(--input-background-disabled)',
        borderTopColor: 'var(--input-border-color)',
        borderRightColor: 'var(--input-border-color)',
        borderBottomColor: 'var(--input-border-color)',
        borderLeftColor: 'var(--input-border-color)',
        boxShadow: 'none',
        cursor: 'not-allowed',
        ':active': {backgroundColor: 'var(--input-background-disabled)'}
    },
    error: {
        borderTopColor: 'var(--negative)',
        borderRightColor: 'var(--negative)',
        borderBottomColor: 'var(--negative)',
        borderLeftColor: 'var(--negative)',
        ':active': {backgroundColor: 'var(--input-background-error-active)'}
    },
    errorFocused: {
        boxShadow: '0 0 0 2px var(--always-white),0 0 0 4px var(--negative)',
        outline: 'none'
    },
    errorHovered: {backgroundColor: 'var(--input-background-error-hover)'},
    focusRing: {
        boxShadow: 'var(--focus-ring-shadow-default)',
        outline: 'none',
        '@media (forced-colors: active)': {
            outline: 'var(--focus-ring-outline-forced-colors)',
        }
    },
    headerMask: {
        backgroundColor: 'var(--input-background)',
        height: '16px',
        right: '16px',
        left: '16px',
        position: 'absolute',
        top: '8px'
    },
    hovered: {
        backgroundColor: 'var(--input-background-hover)',
        borderTopColor: 'var(--input-border-color-hover)',
        borderRightColor: 'var(--input-border-color-hover)',
        borderBottomColor: 'var(--input-border-color-hover)',
        borderLeftColor: 'var(--input-border-color-hover)'
    },
    label: {
        fontSize: '1rem',
        fontWeight: 'normal',
        lineHeight: '1.25',
        maxWidth: '100%',
        transformOrigin: 'top left'
    },
    labelDisabled: {color: 'var(--input-label-color-disabled)'},
    labelError: {color: 'var(--input-label-color-error)'},
    labelHighlighted: {color: 'var(--input-label-color-highlighted)'},
    labelInside: {
        color: 'var(--input-label-color-inside)',
        cursor: 'inherit',
        display: 'block',
        right: '8px',
        left: '16px',
        overflowX: 'hidden',
        overflowY: 'hidden',
        pointerEvents: 'none',
        position: 'absolute',
        textOverflow: 'ellipsis',
        top: '18px',
        transitionDuration: 'var(--fds-fast)',
        transitionProperty: 'transform',
        transitionTimingFunction: 'var(--fds-soft)',
        whiteSpace: 'nowrap'
    },
    labelShrunk: {right: 'auto', transform: 'scale(.75) translateY(-11px)'},
    root: {
        backgroundColor: 'var(--input-background)',
        borderTopColor: 'var(--input-border-color)',
        borderRightColor: 'var(--input-border-color)',
        borderBottomColor: 'var(--input-border-color)',
        borderLeftColor: 'var(--input-border-color)',
        borderTopLeftRadius: 'var(--input-corner-radius)',
        borderTopRightRadius: 'var(--input-corner-radius)',
        borderBottomRightRadius: 'var(--input-corner-radius)',
        borderBottomLeftRadius: 'var(--input-corner-radius)',
        borderTopStyle: 'solid',
        borderRightStyle: 'solid',
        borderBottomStyle: 'solid',
        borderLeftStyle: 'solid',
        borderTopWidth: 'var(--input-border-width)',
        borderRightWidth: 'var(--input-border-width)',
        borderBottomWidth: 'var(--input-border-width)',
        borderLeftWidth: 'var(--input-border-width)',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'hidden',
        position: 'relative',
        zIndex: '0',
        ':active': {backgroundColor: 'var(--input-background-active)'}
    },
    shake: {
        animationDuration: '.82s',
        animationFillMode: 'both',
        animationName: shake,
        animationTimingFunction: 'var(--fds-soft)'
    },
    validationIcon: {paddingRight: '16px', paddingTop: '18px'},
    validationIconHideLabel: {paddingTop: '12px'},
    warn: {
        borderTopColor: 'var(--warning)',
        borderRightColor: 'var(--warning)',
        borderBottomColor: 'var(--warning)',
        borderLeftColor: 'var(--warning)',
        ':active': {backgroundColor: 'var(--input-background-warn-active)'}
    },
    warnFocused: {
        boxShadow: '0 0 0 2px var(--always-white),0 0 0 4px var(--warning)',
        outline: 'none'
    },
    warnHovered: {backgroundColor: 'var(--input-background-warn-hover)'}
})

const styles2 = stylex.create({
    root1: {
        lineHeight: '1.25',
        transformOrigin: 'top left',
        fontWeight: 'normal',
        fontSize: '1rem',
        position: 'relative',
        maxWidth: '100%',
        marginBottom: '8px',
        color: 'var(--text-input-outside-label)'
    },
    container: {display: 'flex', flexDirection: 'column', width: '100%'},
    root3: {
        flexGrow: '1',
        position: 'relative',
        backgroundColor: 'transparent',
        maxWidth: '100%',
        minWidth: '0'
    },
    root4: {
        display: "flex"
    },
    root5: {
        position: 'absolute',
        overflowY: 'hidden',
        width: '1px',
        overflowX: 'hidden',
        height: '1px',
        webkitClipPath: 'inset(50%)',
        clip: 'rect(0,0,0,0)'
    },
    root6: {
        marginTop: "8px"
    }
})

const styles4 = stylex.create({
    root: {
        display: 'flex',
        width: '100%'
    }
})

const cursorStyles = stylex.create({
    pointer: {cursor: 'pointer'}, text: {cursor: 'text'}
})

interface ChildrenParams {
    id: string;
    focusProps: {
        onFocus: Function;
        omBlur: Function;
        isFocused: boolean;
    };
}

interface FormInputWrapperProps {
    onFocusChange?: (isFocusedWithin: boolean) => void;
    children: (params: ChildrenParams) => ReactElement;
    label?: string;
    alwaysShrinkLabel?: boolean;
    shrinkLabelOnFocus?: boolean;
    disabled?: boolean;
    value?: any;
    labelLocation?: 'inside' | 'outside';
    placeholder?: string;
    cursor: 'text' | 'pointer';
    onPress?: Function;
    hideLabel?: boolean;
    suppressFocusRing?: boolean;
    helperText?: string | ReactElement;
    helperTextIsHidden?: boolean;
    validationState?: 'WARN' | 'ERROR';
}

export const FormInputWrapper = (props: FormInputWrapperProps) => {
    const {
        onFocusChange,
        children,
        label,
        alwaysShrinkLabel = false,
        shrinkLabelOnFocus = true,
        disabled = false,
        value,
        labelLocation,
        cursor,
        onPress,
        hideLabel = false,
        suppressFocusRing,
        helperText,
        helperTextIsHidden = false,
        validationState
    } = props;

    const ref = useRef(null);

    const labelId = useId();
    const helperTextId = useId();

    const renderLabel = (isFocus: boolean) => {
        return labelLocation === 'outside' ? (
            <label className={stylex(styles2.root1)} suppressHydrationWarning={true}>
                {label}
            </label>
        ) : (
            <span
                className={stylex(styles.label, styles.labelInside, isFocus && styles.labelHighlighted, (!isEmptyValue(value) || alwaysShrinkLabel || isFocus && shrinkLabelOnFocus) && styles.labelShrunk, disabled && styles.labelDisabled)}>
            {label}
        </span>
        )
    }

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleMouseEnter = useCallback(() => {
        if (!isHovered) {
            setIsHovered(true);
        }
    }, [isHovered])

    const handleMouseLeave = useCallback(() => {
        if (isHovered) {
            setIsHovered(false);
        }
    }, [isHovered]);

    const [shaking, setShaking] = useState(false);

    return (
        <div ref={ref} className={stylex(styles2.container)}>
            {labelLocation === 'outside' && renderLabel(false)}
            <FocusWithinHandler onFocusChange={onFocusChange}>
                {(focusWithinProps: FocusWithinProps, _isFocused: boolean) => {
                    return (
                        <BaseFocusRing suppressFocusRing={!isFocused || suppressFocusRing}>
                            {(focusProps: any, focusXstyle: any) => {
                                return (
                                    <div
                                        {...mergeProps(focusProps, focusWithinProps)}
                                        className={
                                            stylex(styles.root, cursorStyles[cursor],
                                                isHovered && styles.hovered,
                                                _isFocused && styles.focusRing,
                                                validationState === "WARN" && [styles.warn, isHovered && styles.warnHovered, _isFocused && styles.warnFocused],
                                                validationState === "ERROR" && [styles.error, isHovered && styles.errorHovered, _isFocused && styles.errorFocused],
                                                disabled && styles.disabled,
                                                shaking && styles.shake,
                                                focusXstyle)
                                        }>
                                        <label
                                            className={stylex(styles4.root)}
                                            htmlFor={labelId}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            onAnimationEnd={() => {
                                                setShaking(false);
                                            }}
                                            onClick={(event) => {
                                                if (disabled) {
                                                    setShaking(true);
                                                } else {
                                                    if (onPress) {
                                                        onPress(event);
                                                    }
                                                }
                                            }}
                                            suppressHydrationWarning={true}
                                            tabIndex={onPress ? 0 : undefined}
                                        >
                                            <div className={stylex(styles2.root3)}>
                                                {!hideLabel && labelLocation !== 'outside' && renderLabel(_isFocused)}
                                                <FocusWithinHandler
                                                    onFocusChange={setIsFocused}
                                                >
                                                    {(_focusWithinProps: FocusWithinProps) => {
                                                        return children({
                                                            focusProps: {
                                                                ...mergeProps(focusProps, _focusWithinProps),
                                                                isFocused: _isFocused
                                                            },
                                                            id: labelId
                                                        })
                                                    }}
                                                </FocusWithinHandler>
                                            </div>
                                        </label>
                                    </div>
                                )
                            }}
                        </BaseFocusRing>
                    )
                }}
            </FocusWithinHandler>
            {
                helperText && (helperTextIsHidden ? (
                    <div id={helperTextId} className={stylex(styles2.root5)}>
                        {helperText}
                    </div>
                ) : (
                    <div id={helperTextId} className={stylex(styles2.root6)}>
                        {helperText}
                    </div>
                ))
            }
        </div>
    )
}