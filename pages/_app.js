import Head from "next/head";
import "../styles/globals.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "../lib/context/themeContext";
import UserProvider from "../lib/context/userContext";
import BackToTop from "../components/BackToTop/BackToTop"; // Import BackToTop

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <Head>
          <link rel="alternate" type="application/rss+xml" title="Devlog RSS" href="/rss.xml" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <BackToTop /> {/* Added BackToTop button */}
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
