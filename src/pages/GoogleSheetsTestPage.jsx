import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitOrderToSheet, getSheetData } from '../services/googleSheetsService';
import { initializeGapi } from '../services/driveService';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

const GoogleSheetsTestPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null);
    const [lastVerifiedRow, setLastVerifiedRow] = useState(null);

    const handleFullTestSubmit = async () => {
        setIsSubmitting(true);
        setStatus(null);
        setLastVerifiedRow(null);

        try {
            await initializeGapi();

            // Mock Order Data covering all 19 columns
            const mockOrder = {
                orderId: `TEST-${Date.now()}`,
                orderStatus: 'Test-Pending',
                fullName: 'Test User',
                email: 'test@example.com',
                phone: '1234567890',
                companyName: 'Test Company Inc.',          // New Field
                streetAddress: '123 Test St',
                city: 'Test City',
                state: 'Test State',
                zipCode: '12345',
                country: 'Test Country',
                billingAddress: 'Same as Shipping',        // New Field
                productType: 'Custom Frame, Magic Mug',
                quantity: 2,
                totalAmount: 1500,                         // New Field
                paymentMethod: 'UPI',                      // New Field
                orderNotes: 'This is a test order note.',  // New Field
                productDetails: [
                    {
                        name: 'Test Product (Single Item)',
                        type: 'Dynamic Test',
                        price: 500,
                        // Small red dot base64 for testing upload
                        preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwMTQAAAABJRU5ErkJggg=='
                    }
                ]
            };

            const result = await submitOrderToSheet(mockOrder);

            if (result.success) {
                // Verify by reading back the last row
                const sheetData = await getSheetData();
                const lastRow = sheetData[sheetData.length - 1];

                setStatus({
                    type: 'success',
                    message: `✅ Full order submitted successfully! Order ID: ${mockOrder.orderId}`,
                    details: 'Verifying data in sheet...'
                });

                setLastVerifiedRow(lastRow);
            } else {
                throw new Error(result.message);
            }

        } catch (err) {
            console.error('Test failed:', err);
            setStatus({
                type: 'error',
                message: `❌ Test Failed: ${err.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold">Full Integration Verification</h1>
                        <p className="mt-2 text-blue-100">
                            Verify that ALL 19 columns are correctly mapping to your Google Sheet.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className={`p-4 rounded-lg ${isAuthenticated ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {isAuthenticated ? '✅ Authenticated' : '⚠️ Not Authenticated'}
                                    </h3>
                                    {isAuthenticated && currentUser && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Signed in as: {currentUser.email}
                                        </p>
                                    )}
                                </div>
                                {!isAuthenticated && (
                                    <GoogleSignInButton redirectToDashboard={false} buttonText="Sign In to Test" />
                                )}
                            </div>
                        </div>

                        {isAuthenticated && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h3 className="font-semibold text-blue-900 mb-2">Test Scenario</h3>
                                    <p className="text-sm text-blue-800">
                                        Clicking the button below will send a comprehensive test order containing data for
                                        <strong> Company Name, Order Notes, Payment Method, Total Amount, and Billing Address</strong>.
                                    </p>
                                </div>

                                <button
                                    onClick={handleFullTestSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Verifying...' : 'Start Full Data Verification'}
                                </button>

                                {status && (
                                    <div className={`p-6 rounded-lg animate-fade-in ${status.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                        <p className={`font-bold text-lg ${status.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                            {status.message}
                                        </p>

                                        {lastVerifiedRow && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold text-green-900 mb-2">🔍 Verification Result (Last Row from Sheet):</h4>
                                                <div className="bg-white p-4 rounded border border-green-200 text-xs font-mono overflow-x-auto">
                                                    <table className="min-w-full">
                                                        <tbody>
                                                            <tr><td className="font-bold pr-4">Order ID:</td><td>{lastVerifiedRow[1]}</td></tr>
                                                            <tr><td className="font-bold pr-4">Company:</td><td>{lastVerifiedRow[6]}</td></tr>
                                                            <tr><td className="font-bold pr-4">Payment:</td><td>{lastVerifiedRow[16]}</td></tr>
                                                            <tr><td className="font-bold pr-4">Total:</td><td>{lastVerifiedRow[15]}</td></tr>
                                                            <tr><td className="font-bold pr-4">Notes:</td><td>{lastVerifiedRow[17]}</td></tr>
                                                            <tr><td className="font-bold pr-4">Image Link:</td><td className="text-blue-600 underline cursor-pointer" onClick={() => window.open(lastVerifiedRow[18], '_blank')}>{lastVerifiedRow[18] ? 'Click to View Image' : 'No Image'}</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <p className="mt-2 text-green-700 text-sm">
                                                    ✅ Success! The data read back from the sheet matches our test data.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="text-center">
                                    <a
                                        href={`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SHEET_ID}/edit`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 underline"
                                    >
                                        Open Actual Google Sheet to Check
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleSheetsTestPage;
