const listeners = {};

export const feedEvents = {
    emit(event, data) {
        (listeners[event] || []).slice().forEach((cb) => cb(data));
    },

    on(event, cb) {
        if (!listeners[event]) {
            listeners[event] = [];
        }

        listeners[event].push(cb);

        return () => {
            listeners[event] = listeners[event].filter((listener) => listener !== cb);

            if (listeners[event].length === 0) {
                delete listeners[event];
            }
        };
    },
};