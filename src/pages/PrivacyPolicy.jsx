import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Shield,
    Lock,
    Share2,
    Image,
    Cookie,
    Database,
    UserCheck,
    RefreshCw,
    CheckSquare,
    Phone
} from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';

const PrivacyPolicy = () => {
    const policies = [
        {
            title: "Information We Collect",
            icon: FileText,
            content: [
                "Full Name",
                "Mobile Number / WhatsApp Number",
                "Email Address",
                "Delivery Address",
                "Uploaded images, designs, logos, or text",
                "Payment-related confirmation details (we do not store card or UPI details)"
            ]
        },
        {
            title: "How We Use Your Information",
            icon: CheckSquare,
            content: [
                "Processing and fulfilling your orders",
                "Customizing products as per your request",
                "Order confirmation and customer support",
                "Delivery and communication updates",
                "Improving our products and services"
            ]
        },
        {
            title: "Data Protection & Security",
            icon: Shield,
            content: [
                "Your personal data is stored securely and accessed only by authorized personnel.",
                "Uploaded photos, designs, and files are used only for order fulfillment.",
                "We take reasonable measures to prevent unauthorized access, misuse, or disclosure."
            ]
        },
        {
            title: "Sharing of Information",
            icon: Share2,
            content: [
                "We do not sell, rent, or trade your personal information.",
                "Information may be shared only with: Delivery partners (for shipping purposes) and Service providers essential to order completion.",
                "All third parties are required to maintain confidentiality."
            ]
        },
        {
            title: "Image & Content Privacy",
            icon: Image,
            content: [
                "Customer-uploaded images and designs remain private and confidential.",
                "We do not use customer content for marketing or display without prior permission.",
                "Content may be retained temporarily for order records and reprints (if requested)."
            ]
        },
        {
            title: "Cookies & Website Data",
            icon: Cookie,
            content: [
                "Our website may use basic cookies to enhance user experience.",
                "Cookies do not collect personal data unless voluntarily provided."
            ]
        },
        {
            title: "Data Retention",
            icon: Database,
            content: [
                "Personal information is retained only as long as necessary for business, legal, or accounting purposes.",
                "Once no longer required, data is securely deleted."
            ]
        },
        {
            title: "Customer Rights",
            icon: UserCheck,
            content: [
                "Request access to your personal information",
                "Request correction of incorrect data",
                "Request deletion of your data (subject to legal requirements)"
            ]
        },
        {
            title: "Policy Updates",
            icon: RefreshCw,
            content: [
                "Priyo Picxel reserves the right to update or modify this Privacy Policy at any time.",
                "Changes will be effective immediately upon posting."
            ]
        },
        {
            title: "Consent",
            icon: Lock,
            content: [
                "By placing an order, submitting a form, or using our services, you consent to this Privacy Policy."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <Reveal>
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">
                            Privacy & Security
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-display">
                            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Policy</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            At Priyo Picxel, we respect your privacy and are committed to protecting your personal information.
                        </p>
                    </Reveal>
                </div>

                {/* Policies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {policies.map((policy, index) => (
                        <Reveal key={index} delay={index * 0.1}>
                            <motion.div
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full"
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex flex-col items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <policy.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-1">
                                            {index + 1}. {policy.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {policy.content.map((line, i) => (
                                                <li key={i} className="text-gray-600 text-lg leading-relaxed flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2.5 flex-shrink-0" />
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
                    <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Priyo Picxel</h2>
                            <p className="text-blue-200 text-lg mb-8">Digital Printing & Customization Studio</p>

                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <Phone size={18} className="text-green-400" />
                                <span className="font-medium">Customer Support Available</span>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
