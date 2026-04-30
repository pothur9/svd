import Navbar from "../navbar/page";
import Footer from "../footer/page";
import WalletPage from "../../../components/WalletPage";

export default function L2WalletPage() {
  return (
    <>
      <Navbar />
      <WalletPage level="l2" />
      <Footer />
    </>
  );
}
