import React, {useContext, useCallback} from 'react';

import {BaseButtonPopoverContext} from '@stylex-components/context';
import {Pressable} from './Pressable';
import {PressableText} from './PressableText';

export function useFeedPressEventHandler(a, c?: any) {
    return useCallback((e) => {
        a && a(e);
    }, [a, c]);
}

const BaseButton = React.forwardRef(a);

function a(a, b) {
    var d = a.allowClickEventPropagation
        , e = a["aria-activedescendant"]
        , f = a["aria-checked"]
        , g = a["aria-controls"]
        , h = a["aria-current"]
        , k = a["aria-describedby"]
        , l = a["aria-expanded"]
        , m = a["aria-haspopup"]
        , n = a["aria-hidden"]
        , o = a["aria-invalid"]
        , p = a["aria-label"]
        , q = a["aria-labelledby"]
        , r = a["aria-pressed"]
        , s = a["aria-selected"]
        , t = a.children
        , u = a.className_DEPRECATED
        , v = a.disabled;
    v = v === void 0 ? !1 : v;
    var w = a.display;
    w = w === void 0 ? "inline" : w;
    var x = a.focusable
        , y = a.id
        , z = a.label
        , A = a.onBlur
        , B = a.onClick
        , C = a.onContextMenu
        , D = a.onFocus
        , E = a.onFocusChange
        , F = a.onFocusVisibleChange
        , G = a.onHoverChange
        , H = a.onHoverEnd
        , I = a.onHoverMove
        , J = a.onHoverStart
        , K = a.onPressChange
        , L = a.onPressEnd
        , M = a.onPressStart
        , N = a.preventContextMenu
        , O = a.role
        , P = a.style
        , Q = a.suppressFocusRing
        , R = a.suppressHydrationWarning
        , S = a.testid
        , T = a.testOnly_pressed;
    T = T === void 0 ? !1 : T;
    a = a.xstyle;
    O = O === "presentation" ? "none" : O;
    p = O !== "none" ? (p = p) != null ? p : z : void 0;
    z = b;
    b = B;
    var U = M
        , V = C;
    b = useFeedPressEventHandler(B);
    U = useFeedPressEventHandler(M);
    V = useFeedPressEventHandler(C);
    B = useContext(BaseButtonPopoverContext);
    M = {
        accessibilityLabel: p,
        accessibilityRelationship: {
            activedescendant: e,
            controls: g,
            current: h,
            describedby: k,
            haspopup: B != null && m == null ? B.haspopup : m,
            labelledby: q
        },
        accessibilityState: {
            checked: f,
            disabled: v,
            expanded: B != null && l == null ? B.expanded : l,
            hidden: n,
            invalid: o,
            pressed: r,
            selected: s
        },
        className_DEPRECATED: u,
        disabled: v,
        forwardedRef: z,
        nativeID: y,
        onBlur: A,
        onContextMenu: V,
        onFocus: D,
        onFocusChange: E,
        onFocusVisibleChange: F,
        onHoverChange: G,
        onHoverEnd: H,
        onHoverMove: I,
        onHoverStart: J,
        onPress: b,
        onPressChange: K,
        onPressEnd: L,
        onPressStart: U,
        preventContextMenu: N,
        style: P,
        suppressHydrationWarning: R,
        testID: S,
        testOnly_state: {
            disabled: !1,
            focused: !1,
            focusVisible: !1,
            hovered: !1,
            pressed: T
        },
        xstyle: a
    };
    if (w === "block") {
        C = O === "menuitem" || O === "none" || O === "gridcell" || O === "switch" || O === "combobox" || O === "checkbox" || O === "tab" || O === "radio" || O === "option" ? O : "button";

        return (
            <Pressable
                {...Object.assign({}, M, {
                    accessibilityRole: C,
                    allowClickEventPropagation: d,
                    suppressFocusRing: Q,
                    tabbable: x,
                    children: t
                })}
            />
        )
    } else {
        p = O === "combobox" || O === "menuitem" || O === "menuitemcheckbox" || O === "menuitemradio" || O === "option" || O === "none" || O === "tab" ? O : "button";

        return (
            <PressableText
                {...Object.assign({
                    focusable: x
                }, M, {
                    accessibilityRole: p,
                    direction: "none",
                    suppressFocusRing: Q,
                    children: t
                })}/>
        )
    }
}

export {BaseButton}