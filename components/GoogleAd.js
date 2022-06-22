import React from 'react';

export default class Google extends React.Component {
    componentDidMount() {
        if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    render() {
        return (
            <ins className="adsbygoogle flex items-center justify-self-center self-center m-auto w-1/3 md:w-3/4 my-4"
                data-ad-client={this.props.client}
                data-ad-slot={this.props.slot}
                data-ad-format={this.props.format || "auto"}
                data-ad-layout={this.props.layout || "in-article"}
                data-full-width-responsive="true">
            </ins>
        );
    }
};