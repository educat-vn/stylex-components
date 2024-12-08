let _isPassiveEventListenerSupported = false;

try {
    let c = Object.defineProperty({}, "passive", {
        get: function () {
            _isPassiveEventListenerSupported = true;
        },
    });

    //@ts-ignore
    window.addEventListener("test", null, c);
} catch (error) {}

let isPassiveEventListenerSupported = _isPassiveEventListenerSupported;

function makeEventOptions(a: any) {
    return isPassiveEventListenerSupported ? a : typeof a === "boolean" ? a : a.capture || false;
}

export const passiveEventListenerUtil = {
    isPassiveEventListenerSupported,
    makeEventOptions,
};
