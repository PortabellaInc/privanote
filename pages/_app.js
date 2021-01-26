import Head from 'next/head';
import '../tailwind.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PrivaNote</title>
        <link rel="icon" href="/logo.png" />
        {process.browser && (
          <script
            async
            defer
            data-domain="privanote.xyz"
            src="https://stats.privanote.xyz/js/index.js"
          ></script>
        )}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
