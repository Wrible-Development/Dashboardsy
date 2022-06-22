import { useEffect, useState } from "react";

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.log(error);
                return initialValue;
            }
        }
    });

    const setValue = (value) => {
        if (typeof window !== 'undefined') {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);

                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.log(error);
            }
        }
    };
    return [storedValue, setValue];
};

const useTheme = () => {
    const [theme, setTheme] = useLocalStorage("theme", "dark")
    const isDark = theme === "dark"
    useEffect(() => {
        if (typeof window !== 'undefined') {
            isDark ? window.document.body.classList.add('dark') : window.document.body.classList.remove('dark');
        }
    }, [isDark]);
    return [theme, setTheme]
}

export default useTheme;