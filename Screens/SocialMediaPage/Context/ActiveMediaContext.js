import React, { createContext, useContext, useMemo, useState } from "react";

const ActiveMediaContext = createContext({
    activeId: null,
    setActiveId: () => { },
});

export function ActiveMediaProvider({ children }) {
    const [activeId, setActiveId] = useState(null);

    const value = useMemo(() => ({ activeId, setActiveId }), [activeId]);

    return (
        <ActiveMediaContext.Provider value={value}>
            {children}
        </ActiveMediaContext.Provider>
    );
}

export function useActiveMedia() {
    return useContext(ActiveMediaContext);
}