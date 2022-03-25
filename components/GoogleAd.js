import React from 'react';
import config from '../config.json'

export default class Google extends React.Component {
    componentDidMount() {
        if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    render() {
        return (
            <ins className="adsbygoogle"
                style={{ display: 'flex', justifySelf: 'center', alignSelf: 'center', margin: "auto", maxWidth: this.props.isMobile ? "30%" : "80%", marginTop: "10px" }}
                data-ad-client={config.ads.adsense.dataaddclient}
                data-ad-slot={config.ads.adsense.dataaddslot}
                data-ad-format={this.props.layout || "auto"}
                data-full-width-responsive="true">
            </ins>
        );
    }
};