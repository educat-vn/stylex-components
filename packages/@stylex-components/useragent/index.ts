import UserAgentData from './lib/userAgentData';
import VersionRange from './lib/VersionRange';
import memoizeStringOnly from './lib/memoizeStringOnly';

function h(a, b, d, e?: any) {
    if (a === d)
        return !0;
    if (!d.startsWith(a))
        return !1;
    d = d.slice(a.length);
    if (b != null) {
        d = e ? e(d) : d;
        return VersionRange.contains(d, b)
    }
    return !1
}

function i(a: string) {
    return UserAgentData.platformName === "Windows" ? a.replace(/^\s*NT/, "") : a
}

export const UserAgent = {
    isBrowser: memoizeStringOnly(function(a: string) {
        return h(UserAgentData.browserName, UserAgentData.browserFullVersion, a)
    }),
    isBrowserArchitecture: memoizeStringOnly(function(a: string) {
        return h(UserAgentData.browserArchitecture, null, a)
    }),
    isDevice: memoizeStringOnly(function(a: string) {
        return h(UserAgentData.deviceName, null, a)
    }),
    isEngine: memoizeStringOnly(function(a: string) {
        return h(UserAgentData.engineName, UserAgentData.engineVersion, a)
    }),
    isPlatform: memoizeStringOnly(function(a: string) {
        return h(UserAgentData.platformName, UserAgentData.platformFullVersion, a, i)
    }),
    isPlatformArchitecture: memoizeStringOnly(function(a: string) {
        return h(UserAgentData.platformArchitecture, null, a)
    })
};
