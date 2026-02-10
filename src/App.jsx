import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import About from './pages/About';
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
import ProductCustomizationPage from './pages/ProductCustomizationPage';
import FloatingActions from './components/FloatingActions/FloatingActions';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import GoogleSheetsTestPage from './pages/GoogleSheetsTestPage';
import ExampleOrderForm from './components/ExampleOrderForm';
import SheetSetup from './pages/SheetSetup';

import { gapi } from 'gapi-script';
import { initializeGapi } from './services/driveService';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;

// Create a layout wrapper component to handle conditional rendering
const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="font-sans flex flex-col min-h-screen">
            {!isAuthPage && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

function App() {
    useEffect(() => {
        const start = async () => {
            try {
                await initializeGapi();
            } catch (error) {
                console.error("Failed to initialize Gapi in App:", error);
            }
        };
        gapi.load('client', start);
    }, []);

    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
        console.error("Missing Google Client ID. Please update .env file.");
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h2>
                    <p className="text-gray-600 mb-4">
                        Google Client ID is missing or invalid. Please update your <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file with a valid
                        <code className="bg-gray-100 px-1 py-0.5 rounded ml-1">VITE_GOOGLE_CLIENT_ID</code>.
                    </p>
                    <p className="text-sm text-gray-500">
                        Check the console for more details.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <ScrollToTop />
            <FloatingActions />
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
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

                    {/* Auth Routes */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Test Page for Google Sheets Integration */}
                    <Route path="/test-sheets" element={<GoogleSheetsTestPage />} />

                    {/* Example Order Form */}
                    <Route path="/example-order" element={<ExampleOrderForm />} />

                    {/* Product Customization Page */}
                    <Route path="/customize/:productId" element={<ProductCustomizationPage />} />

                    {/* Sheet Setup Page */}
                    <Route path="/setup-sheet" element={<SheetSetup />} />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}


export default App;
