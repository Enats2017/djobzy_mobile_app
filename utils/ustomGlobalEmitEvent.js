const listeners = {};

export const globalEvent = {
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

// Central place for event name constants — avoids typos like
// 'ROOM_DELETD' silently breaking the subscription.
export const EVENTS = {
    ROOM_DELETED: 'ROOM_DELETED',
    ROOM_CREATED: 'ROOM_CREATED',
    ROOM_UPDATED: 'ROOM_UPDATED',
};