/**
 * Receipt Generator Utility
 * Generate downloadable receipts in various formats
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generate receipt as PNG image
 * @param {HTMLElement} element - Receipt element to convert
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const downloadReceiptAsPNG = async (element, filename = 'receipt.png') => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    } catch (error) {
        console.error('Error generating PNG receipt:', error);
        throw new Error('Failed to generate receipt image');
    }
};

/**
 * Generate receipt as PDF
 * @param {HTMLElement} element - Receipt element to convert
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const downloadReceiptAsPDF = async (element, filename = 'receipt.pdf') => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(filename);
    } catch (error) {
        console.error('Error generating PDF receipt:', error);
        throw new Error('Failed to generate PDF receipt');
    }
};

/**
 * Print receipt
 * @param {HTMLElement} element - Receipt element to print
 * @returns {void}
 */
export const printReceipt = (element) => {
    try {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Pop-up blocked. Please allow pop-ups for this site.');
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order Receipt</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    @media print {
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        @page {
                            margin: 1cm;
                        }
                    }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    } catch (error) {
        console.error('Error printing receipt:', error);
        throw new Error('Failed to print receipt');
    }
};

/**
 * Generate receipt filename based on order details
 * @param {Object} orderDetails - Order details
 * @param {string} extension - File extension (pdf, png)
 * @returns {string} Formatted filename
 */
export const generateReceiptFilename = (orderDetails, extension = 'pdf') => {
    const { orderId, customerName } = orderDetails;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const sanitizedName = customerName?.replace(/[^a-zA-Z0-9]/g, '_') || 'customer';

    return `PriyoPixcel_Receipt_${orderId}_${sanitizedName}_${date}.${extension}`;
};

/**
 * Share receipt via email (using mailto)
 * @param {Object} orderDetails - Order details
 * @returns {void}
 */
export const shareReceiptViaEmail = (orderDetails) => {
    const { orderId, email, customerName, totalAmount } = orderDetails;

    const subject = encodeURIComponent(`Order Confirmation - ${orderId}`);
    const body = encodeURIComponent(`
Dear ${customerName},

Thank you for your order with PriyoPixcel!

Order ID: ${orderId}
Total Amount: ₹${totalAmount?.toLocaleString()}

We're processing your order and will send you tracking information shortly.

For any questions, please reply to this email or contact us at support@priyopixcel.com.

Best regards,
PriyoPixcel Team
    `.trim());

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
};

/**
 * Generate QR code URL for order tracking
 * @param {string} orderId - Order ID
 * @returns {string} Tracking URL
 */
export const generateTrackingURL = (orderId) => {
    // This would be your actual tracking page URL
    return `https://priyopixcel.com/track-order?id=${orderId}`;
};

export default {
    downloadReceiptAsPNG,
    downloadReceiptAsPDF,
    printReceipt,
    generateReceiptFilename,
    shareReceiptViaEmail,
    generateTrackingURL,
};
