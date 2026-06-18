const listeners = {};

export const chatEvents = {
    emit: (event, data) => {
        (listeners[event] || []).forEach((cb) => cb(data));
    },
    on: (event, cb) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
        // Return unsubscribe function
        return () => {
            listeners[event] = listeners[event].filter((l) => l !== cb);
        };
    },
};