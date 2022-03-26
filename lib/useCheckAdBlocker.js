import { useState, useEffect } from 'react'


/**
 * Checks if the user is using an adblocker or not.
 * @returns {Boolean}
 */
export default function useCheckAdBlocker() {
    const [isAdBlocker, setIsAdBlocker] = useState(false)
    useEffect(async() => {
        try {
            await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
                method: 'HEAD'
            })
        } catch (e) {
            setIsAdBlocker(true)
        }
    }, [])

    return isAdBlocker;
}