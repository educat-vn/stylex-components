import {ChangeEvent, forwardRef, LegacyRef, memo} from "react";
import stylex from '@stylexjs/stylex';
import {mergeProps} from '@react-aria/utils';

import {BaseFocusRing} from '@stylex-components/focus';
import {BaseInput} from "./BaseInput.tsx";

const styles = stylex.create({
    root: {
        ':disabled': {
            color: 'var(--disabled-text)'
        }
    }
});

interface BaseTextInputProps {
    disabled?: boolean;
    id?: string;
    suppressFocusRing?: boolean;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onValueChange?: (value: string) => void;
    xstyle?: any;
    placeholder?: string | null;
    value?: string;
    autoComplete?: 'off';
}

const BaseTextInput = (props: BaseTextInputProps, ref: LegacyRef<HTMLTextAreaElement | HTMLInputElement>) => {
    const {suppressFocusRing, xstyle, ...inputProps} = props;

    return (
        <BaseFocusRing suppressFocusRing={suppressFocusRing}>
            {(focusProps: any, focusXstyle: any) => {
                return (
                    <BaseInput ref={ref} xstyle={[styles.root, focusXstyle, xstyle]} {...mergeProps(inputProps, focusProps)} />
                )
            }}
        </BaseFocusRing>
    );
}

let _BaseTextInput = memo(forwardRef(BaseTextInput));
export {_BaseTextInput as BaseTextInput};