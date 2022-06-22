import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOut, faMoon, faSun, faCoins, faGear } from '@fortawesome/free-solid-svg-icons'

export default class Navbar extends React.Component {
    render() {
        const { theme, setTheme, isDark, config, user } = this.props;
        return (
            <div className="flex w-full px-8 md:px-12 lg:px-16 2xl:px-32 justify-between items-center text-center py-6 bg-[#f0f0f0] text-gray-900 dark:text-gray-200 dark:bg-[#1f2832] text-2xl shadow-md drop-shadow-sm">
                <div className="flex items-center start">
                    <p>{config.hostname}</p>
                </div>
                <div className="flex items-center end">
                    {isDark || !theme ? <FontAwesomeIcon icon={faSun} className="w-6 h-6 mx-3 md:mx-5 cursor-pointer transition-color duration-500 motion-reduce:transition-none hover:text-gray-700 dark:hover:text-gray-400" onClick={() => setTheme('light')} /> : <FontAwesomeIcon icon={faMoon} className="w-6 h-6 mx-3 md:mx-5 cursor-pointer transition-color duration-500 motion-reduce:transition-none hover:text-gray-700 dark:hover:text-gray-400" onClick={() => setTheme('dark')} />}
                    {user.isadmin ? <a href="/coins"><FontAwesomeIcon icon={faGear} className="w-6 h-6 mx-3 md:mx-5 transition-color duration-500 motion-reduce:transition-none hover:text-gray-700 dark:hover:text-gray-400" /></a> : null}
                    <a href="/coins"><FontAwesomeIcon icon={faCoins} className="w-6 h-6 mx-3 md:mx-5 transition-color duration-500 motion-reduce:transition-none hover:text-gray-700 dark:hover:text-gray-400" /></a>
                    <a href="/user"><FontAwesomeIcon icon={faUser} className="w-6 h-6 mx-3 md:mx-5 transition-color duration-500 motion-reduce:transition-none hover:text-gray-700 dark:hover:text-gray-400" /></a>
                    <a href="/auth/signout"><FontAwesomeIcon icon={faSignOut} className="w-6 h-6 mx-3 md:mx-5 transition-color duration-500 motion-reduce:transition-none hover:text-gray-700 dark:hover:text-gray-400" /></a>
                </div>
            </div>
        );
    }
};