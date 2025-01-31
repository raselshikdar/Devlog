import "../styles/globals.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "../lib/context/themeContext";
import UserProvider from "../lib/context/userContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
