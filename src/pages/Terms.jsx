import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    AlertTriangle,
    Copyright,
    Truck,
    ShieldAlert,
    RefreshCcw,
    Fingerprint,
    Ban,
    CreditCard
} from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';

const Terms = () => {
    const terms = [
        {
            title: "Customized Products",
            icon: CheckCircle2,
            content: [
                "All products offered by Priyo Picxel are customized as per customer requirements.",
                "Customers are responsible for providing accurate text, images, sizes, colors, and design details.",
                "Once the order is confirmed, changes may not be possible."
            ]
        },
        {
            title: "Design Approval",
            icon: FileText,
            content: [
                "A digital preview may be shared for approval (where applicable).",
                "Printing will begin only after customer approval.",
                "Priyo Picxel is not responsible for errors approved by the customer (spelling, color choice, layout, etc.)."
            ]
        },
        {
            title: "Image & Content Responsibility",
            icon: AlertTriangle,
            content: [
                "Customers must ensure that uploaded images, logos, and text do not violate copyright, trademark, or legal rights.",
                "Priyo Picxel holds no liability for content provided by the customer.",
                "Low-resolution images may affect print quality."
            ]
        },
        {
            title: "Pricing & Payment",
            icon: CreditCard,
            content: [
                "All prices are listed in INR (₹) and are subject to change without prior notice.",
                "Full or partial payment may be required before order processing.",
                "Orders will be processed only after payment confirmation."
            ]
        },
        {
            title: "No Return / No Refund Policy",
            icon: Ban,
            content: [
                "Due to the customized nature of products, returns, cancellations, or refunds are not allowed once production has started.",
                "Refunds will be considered only in case of manufacturing defects verified by Priyo Picxel."
            ]
        },
        {
            title: "Delivery & Shipping",
            icon: Truck,
            content: [
                "Estimated delivery time is provided for reference and may vary due to courier delays or unforeseen circumstances.",
                "Priyo Picxel is not responsible for delays caused by courier partners, natural events, or incorrect address details."
            ]
        },
        {
            title: "Color Variation Disclaimer",
            icon: RefreshCcw,
            content: [
                "Slight color differences may occur due to screen resolution, lighting, and printing process.",
                "Such variations are considered normal and not defects."
            ]
        },
        {
            title: "Order Cancellation",
            icon: ShieldAlert,
            content: [
                "Orders cannot be cancelled once design approval or printing has started.",
                "Cancellation requests before processing may be considered at Priyo Picxel’s discretion."
            ]
        },
        {
            title: "Intellectual Property",
            icon: Copyright,
            content: [
                "All designs created by Priyo Picxel remain our intellectual property unless otherwise agreed.",
                "Unauthorized copying or reproduction is strictly prohibited."
            ]
        },
        {
            title: "Privacy Policy",
            icon: Fingerprint,
            content: [
                "Customer information is kept confidential and used only for order processing and communication.",
                "We do not sell or share customer data with third parties."
            ]
        },
        {
            title: "Right to Refuse Service",
            icon: Ban,
            content: [
                "Priyo Picxel reserves the right to refuse any order that contains offensive, illegal, or inappropriate content."
            ]
        },
        {
            title: "Acceptance of Terms",
            icon: CheckCircle2,
            content: [
                "By placing an order, submitting a form, or making payment, the customer agrees to all Terms & Conditions stated above."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <Reveal>
                        <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-4">
                            Legal Information
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-display">
                            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Conditions</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Please read these terms carefully before placing your order with Priyo Picxel.
                        </p>
                    </Reveal>
                </div>

                {/* Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {terms.map((term, index) => (
                        <Reveal key={index} delay={index * 0.1}>
                            <motion.div
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full"
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex flex-col items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                        <term.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-1">
                                            {index + 1}. {term.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {term.content.map((line, i) => (
                                                <li key={i} className="text-gray-600 text-lg leading-relaxed flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-2.5 flex-shrink-0" />
                                                    {line}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>

                {/* Footer Section */}
                <Reveal>
                    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Priyo Picxel</h2>
                            <p className="text-purple-200 text-lg mb-8">Digital Printing & Customization Studio</p>

                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="font-medium">Customer Support Available</span>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default Terms;
