import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const useIdleTimeout = (timeoutDuration = 20 * 60 * 1000) => {
    const { logout } = useAuth();

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    useEffect(() => {
        let timeout;

        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(handleLogout, timeoutDuration);
        };

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimeout));

        resetTimeout();


        const handleBeforeUnload = () => {
            logout();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (timeout) clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimeout));
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleLogout, timeoutDuration]);

    return null;
};

export default useIdleTimeout;