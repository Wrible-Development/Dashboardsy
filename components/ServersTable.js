import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

export default class ResourceBox extends React.Component {
    render() {
        return (
            <>
                <div className="bg-[#f0f0f0] dark:bg-[#1f2832] text-gray-900 dark:text-gray-200 m-1 lg:m-3 lg:text-xl 2xl:text-2xl rounded-md shadow-md drop-shadow-sm p-3">
                    <div className="items-center flex justify-center mb-3">
                        <h1 className="inline-flex text-3xl">Your services</h1>
                    </div>
                    <div className="flex flex-col p-2">
                        <div className="grid grid-cols-3 my-2 rounded-md mb-2 ">
                            <GridItem>Name</GridItem>
                            <GridItem>Plan</GridItem>
                            <GridItem>Actions</GridItem>
                        </div>
                        <GridChild>
                            <GridItem>Test</GridItem>
                            <GridItem>Bronze</GridItem>
                            <GridItem><FontAwesomeIcon icon={faTrash} className="w-6 h-6 mx-3 md:mx-5 text-red-500" /><FontAwesomeIcon icon={faEdit} className="w-6 h-6 mx-3 md:mx-5 text-blue-500" /></GridItem>
                        </GridChild>
                        <GridChild>
                            <GridItem>Test</GridItem>
                            <GridItem>Bronze</GridItem>
                            <GridItem><FontAwesomeIcon icon={faTrash} className="w-6 h-6 mx-3 md:mx-5 text-red-500" /><FontAwesomeIcon icon={faEdit} className="w-6 h-6 mx-3 md:mx-5 text-blue-500" /></GridItem>
                        </GridChild>
                        <GridChild>
                            <GridItem>Test</GridItem>
                            <GridItem>Bronze</GridItem>
                            <GridItem><FontAwesomeIcon icon={faTrash} className="w-6 h-6 mx-3 md:mx-5 text-red-500" /><FontAwesomeIcon icon={faEdit} className="w-6 h-6 mx-3 md:mx-5 text-blue-500" /></GridItem>
                        </GridChild>
                    </div>
                </div>
            </>
        );
    }
};

const GridChild = ({ children, className }) => (
    <div className={"grid grid-cols-3 my-2 " + className}>
        <hr className="col-span-3 mb-3" />
        {children}
    </div>
)

const GridItem = ({ children, className }) => (
    <p className={`${className} flex justify-center items-center`}>
        {children}
    </p>
)