import Head from "next/head";
import "../styles/globals.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "../lib/context/themeContext";
import UserProvider from "../lib/context/userContext";
import BackToTop from "../components/BackToTop/BackToTop";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <Head>
          <link rel="alternate" type="application/rss+xml" title="Devlog RSS" href="/rss.xml" />
          {/* Other global meta tags can be added here if needed */}
        </Head>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <BackToTop />
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
