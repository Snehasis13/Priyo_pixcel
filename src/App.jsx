import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Blog from './pages/Blog';
import ScrollToTop from './utils/ScrollToTop';
import CustomPhotoFrame from './pages/CustomPhotoFrame';
import FloatingActions from './components/FloatingActions/FloatingActions';

function App() {
    return (
        <>
            <ScrollToTop />
            <FloatingActions />
            <div className="font-sans flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/custom-frame" element={<CustomPhotoFrame />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default App;
