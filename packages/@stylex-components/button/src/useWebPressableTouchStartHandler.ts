import React, { useEffect } from "react";

import { useDynamicCallbackDANGEROUS } from "@stylex-components/hooks";
import {UserAgent} from "@stylex-components/useragent";
import { passiveEventListenerUtil } from "./passiveEventListenerUtil";
import {hasNode} from './utils'

let isSafari = UserAgent.isBrowser("Safari") || UserAgent.isBrowser("Mobile Safari");

var j = isSafari
    ? function (a) {
        var b =
            (a = window) == null
                ? undefined
                : (a = a.document) == null
                    ? undefined
                    : a.body;
        if (b == null) return;
        b.style.WebkitUserSelect = "none";
        var c = passiveEventListenerUtil.makeEventOptions({
            passive: true,
        });
        a = function a() {
            (b.style.WebkitUserSelect = null),
                document.removeEventListener("touchend", a, c);
        };
        document.addEventListener("touchend", a, c);
        return a;
    }
    : null;

export function useWebPressableTouchStartHandler(ref: React.RefObject<HTMLElement>, b, callback: any) {
    var f = useDynamicCallbackDANGEROUS(callback);
    useEffect(
        function () {
            var c;
            if (!b && !j) return;
            var e = ref.current;
            c =
                (c = window) == null
                    ? undefined
                    : (c = c.document) == null
                        ? undefined
                        : c.body;
            if (!e || !c || !e.addEventListener || !hasNode(e)) return;
            var g;
            b &&
            (b.register(e, f),
                (g = function (a) {
                    a.preventDefault(), b.onTouchStart();
                }));
            var h,
                i =
                    g || j
                        ? function (a) {
                            g == null ? undefined : g(a), (h = j == null ? undefined : j(a));
                        }
                        : null,
                l = i
                    ? passiveEventListenerUtil.makeEventOptions({
                        passive: !b,
                    })
                    : null;
            i && l != null && e.addEventListener("touchstart", i, l);
            return function () {
                h == null ? undefined : h(),
                    b == null ? undefined : b.unRegister(e),
                i && l != null && e.removeEventListener("touchstart", i, l);
            };
        },
        [f, ref, b]
    );
}
