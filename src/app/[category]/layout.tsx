import Footer from "@/components/UserFlow/Footer";
import Navbar from "@/components/UserFlow/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  );
}
