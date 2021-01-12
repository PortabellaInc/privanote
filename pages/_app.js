import Head from 'next/head';
import '../tailwind.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>QuickNote</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          defer
          data-domain="alexbh.dev"
          src="https://stats.quicknote.com/js/index.js"
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
