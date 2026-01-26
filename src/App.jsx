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
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AllProducts from './pages/AllProducts';
import ProductDetails from './pages/ProductDetails';
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
                        <Route path="/products" element={<AllProducts />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/custom-frame" element={<CustomPhotoFrame />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default App;
