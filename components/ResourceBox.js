import React from 'react';

export default class ResourceBox extends React.Component {
    render() {
        return (
            <>
                <div className="flex w-max-3/4 px-3 py-8 flex-col bg-[#f0f0f0] dark:bg-[#1f2832] rounded text-md md:text-xl m-1 lg:m-3 shadow-md drop-shadow-sm">
                    <div className="flex text-md justify-center text-gray-600 dark:text-gray-400">{this.props.name}</div>
                    <div className="flex text-2xl justify-center md:text-3xl text-gray-800 dark:text-gray-200">{this.props.value}</div>
                </div>
            </>
        );
    }
};