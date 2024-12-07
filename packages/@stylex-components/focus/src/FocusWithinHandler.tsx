import {useState} from 'react';
import {useFocusWithin, FocusWithinProps} from '@react-aria/interactions';

interface FocusWithinHandlerProps extends FocusWithinProps {
    children: Function;
    onFocusChange?: (isFocusWithin: boolean) => void;
}

export const FocusWithinHandler = (props: FocusWithinHandlerProps) => {
    const {children, onFocusChange, ...focusProps} = props;

    const [isFocusedWithin, setIsFocusedWithin] = useState(false);

    const handleFocusWithinChange = (isFocusWithin: boolean) => {
        setIsFocusedWithin(isFocusWithin);

        if (typeof onFocusChange === 'function') {
            onFocusChange(isFocusWithin);
        }
    }

    const {focusWithinProps} = useFocusWithin({...focusProps, onFocusWithinChange: handleFocusWithinChange});

    return children(focusWithinProps, isFocusedWithin);
}