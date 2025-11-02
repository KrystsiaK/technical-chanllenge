const isBrowser = typeof window !== 'undefined';


export const safeLocalStorage: Storage = isBrowser
    ? window.localStorage
    : new Proxy({} as Storage, {
        get: (target, prop) => {
            if (prop === 'getItem') return () => null;
            if (prop === 'setItem') return () => null;
            if (prop === 'removeItem') return () => null;
            if (prop === 'clear') return () => null;
            if (prop === 'key') return () => null;
            if (prop === 'length') return 0;
            return undefined;
        },
        set: () => {
            return true;
        }
    })