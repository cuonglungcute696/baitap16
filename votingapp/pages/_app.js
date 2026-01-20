import "../styles/globals.css";
import { VoterProvider } from "../context/Voter";
import { ToastProvider } from "../components/Toast/Toast";

const MyApp = ({ Component, pageProps }) => (
  <ToastProvider>
    <VoterProvider>
      <Component {...pageProps} />
    </VoterProvider>
  </ToastProvider>
);

export default MyApp;