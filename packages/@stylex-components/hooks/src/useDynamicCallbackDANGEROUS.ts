import { useCallback, useLayoutEffect, useRef } from "react";

export const useDynamicCallbackDANGEROUS = (a: any) => {
    const ref = useRef(a);
    useLayoutEffect(() => {
        ref.current = a;
    }, [a]);

    return useCallback((...args: any) => {
        return ref.current.apply(ref, args);
    }, []);
};
