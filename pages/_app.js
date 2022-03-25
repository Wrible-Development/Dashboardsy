import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import Head from 'next/head'
import config from '../config.json'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.name}</title>
        <link rel="icon" href="/favicon.png" />
        {config.ads.adsense.enabled && <script async src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + config.ads.adsense.dataaddclient} crossorigin="anonymous"></script>}
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default MyApp
