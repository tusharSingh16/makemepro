import Navbar from '@/components/UserFlow/NavBar';
import Footer from '@/components/UserFlow/Footer';
import Fav from '@/components/favoritesComp/fav'

const page = () => {
  return (
    <>
      <Navbar/>
      <Fav/>
      <Footer/>
    </>
  )
}

export default page