import Head from 'next/head'
import '../styles/o.css'
import React from 'react';
import { executeQuery } from '../db'
import App from 'next/app'

function MyApp({
  config,
  Component,
  pageProps: { ...pageProps }
}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.hostname}{pageProps.pageName && ` - ${pageProps.pageName}`}</title>
        <link rel="icon" href="/favicon.png" />
        {config.adsenseclient && <script async src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + config.adsenseclient} crossOrigin="anonymous"></script>}
      </Head>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const config = (await executeQuery("SELECT hostname, adsenseclient FROM config;"))[0] || {
    hostname: "Dashboardsy",
    adsenseclient: ""
  }
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, config: config }
}

export default MyApp
