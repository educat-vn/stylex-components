import React, {
    ChangeEvent,
    forwardRef,
    LegacyRef,
    memo,
    RefObject,
    useMemo
} from "react";
import {InputBase} from '@react-types/shared';
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
    root: {
        WebkitTapHighlightColor: 'transparent',
        boxSizing: 'border-box',
        touchAction: 'manipulation',
        ':disabled': { cursor: 'not-allowed' }
    },
    zIndex: { zIndex: '1' }
})

interface BaseInputProps {
    xstyle?: any;
    onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onValueChange?: (value: string | boolean, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement, MouseEvent>) => void;
    type?: string;
}

const BaseInput = (props: InputBase & BaseInputProps, ref: LegacyRef<HTMLTextAreaElement | HTMLInputElement>) => {
    const {
        xstyle,
        onChange,
        onValueChange,
        onClick,
        type = 'text',
        ...rest
    } = props;

    const inputType = useMemo(() => {
        switch (type) {
            case "switch":
                return "checkbox";
            default:
                return type
        }
    }, [type]);

    const isCheckboxOrRadio = inputType === "checkbox" || inputType === "radio";
    const isTextarea = inputType === "textarea";

    const inputProps = {
        dir: 'ltr',
        ...rest,
        className: stylex(styles.root, xstyle, styles.zIndex),
        onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            if (!isCheckboxOrRadio && typeof onValueChange === 'function') {
                onValueChange(event.target.value, event);
            }

            if (typeof onChange === 'function') {
                onChange(event);
            }
        },
        onClick: (event: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement, MouseEvent>) => {
            if (isCheckboxOrRadio && typeof onValueChange === 'function') {
                onValueChange((event as unknown as ChangeEvent<HTMLInputElement>).target.checked, event as unknown as ChangeEvent<HTMLInputElement>);
            }

            if (typeof onClick === 'function') {
                onClick(event);
            }
        }
    }

    return isTextarea ? (
        <textarea ref={ref as RefObject<HTMLTextAreaElement>} {...inputProps}/>
    ) : (
        <input ref={ref as RefObject<HTMLInputElement>} {...inputProps} type={inputType} />
    );
}

let _BaseInput = memo(forwardRef(BaseInput));
export {_BaseInput as BaseInput};
