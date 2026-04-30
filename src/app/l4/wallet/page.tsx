"use client"
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import WalletPage from "../../../components/WalletPage";

export default function L4WalletPage() {
  return (
    <>
      <Navbar />
      <WalletPage level="l4" />
      <Footer />
    </>
  );
}
