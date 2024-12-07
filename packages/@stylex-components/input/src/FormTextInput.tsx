import {ReactElement} from "react";
import stylex from '@stylexjs/stylex';

import {BaseTextInput} from './BaseTextInput';
import {FormInputWrapper} from './FormInputWrapper';

const styles = stylex.create({
    disabled: {
        backgroundColor: 'var(--input-background-disabled)',
        color: 'var(--disabled-text)',
        cursor: 'not-allowed'
    },
    imageIcon: {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
        borderBottomLeftRadius: '8px',
        boxShadow: 'inset 0 0 0 1px var(--media-inner-border)'
    },
    input: {
        backgroundColor: 'transparent',
        borderTopColor: null,
        borderRightColor: null,
        borderBottomColor: null,
        borderLeftColor: null,
        borderTopWidth: null,
        borderRightWidth: null,
        borderBottomWidth: null,
        borderLeftWidth: null,
        borderTopStyle: 'none',
        borderRightStyle: 'none',
        borderBottomStyle: 'none',
        borderLeftStyle: 'none',
        boxSizing: 'border-box',
        color: 'var(--primary-text)',
        fontSize: '1rem!important',
        fontWeight: 'normal',
        lineHeight: '1.25',
        paddingBottom: '10px',
        paddingRight: '16px',
        paddingLeft: '16px',
        paddingTop: '26px',
        width: '100%',
        '::-ms-clear': {display: 'none'},
        '::-ms-reveal': {display: 'none'}
    },
    readOnly: {backgroundColor: 'var(--input-background-disabled)'}
});

interface FormTextInputProps {
    label?: string;
    value?: any;
    onValueChange?: (value: any) => void;
    disabled?: boolean;
    labelLocation?: 'inside' | 'outside';
    placeholder?: string;
    autoComplete?: 'off';
    onPress?: Function;
    helperText?: string | ReactElement;
    helperTextIsHidden?: boolean;
    validationState?: 'WARN' | 'ERROR';
}

export const FormTextInput = (props: FormTextInputProps) => {
    const {
        label,
        value,
        onValueChange,
        disabled = false,
        labelLocation = 'inside',
        placeholder,
        autoComplete,
        onPress,
        helperText,
        helperTextIsHidden = false,
        validationState,
        ...rest
    } = props;

    return (
        <FormInputWrapper
            cursor='text'
            label={label}
            value={value}
            labelLocation={labelLocation}
            placeholder={placeholder}
            onPress={onPress}
            helperText={helperText}
            helperTextIsHidden={helperTextIsHidden}
            validationState={validationState}
        >
            {(childrenParams) => {
                const {id, focusProps} = childrenParams;
                const {isFocused, ..._focusProps} = focusProps;

                return (
                    <BaseTextInput
                        autoComplete={autoComplete}
                        id={id}
                        disabled={disabled}
                        onValueChange={onValueChange}
                        placeholder={isFocused ? placeholder : null}
                        suppressFocusRing={true}
                        value={value}
                        xstyle={[styles.input, disabled && styles.disabled]}
                        {...rest}
                        {..._focusProps}
                    />
                )
            }}
        </FormInputWrapper>
    );
}