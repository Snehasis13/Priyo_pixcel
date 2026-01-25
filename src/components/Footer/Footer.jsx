import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center">
                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-y-4 text-center mb-8">
                        {[
                            { label: "About Us", href: "/about" },
                            { label: "Products", href: "/products" },
                            { label: "Shipping", href: "/shipping" },
                            { label: "Customized Products", href: "/custom-frame" },
                            { label: "Privacy Policies", href: "/privacy" },
                            { label: "Terms and Conditions", href: "/terms" },
                            { label: "Contact Us", href: "/contact" }
                        ].map((link, index, array) => (
                            <div key={index} className="flex items-center">
                                <a
                                    href={link.href}
                                    className="text-gray-400 hover:text-[#EA7704] transition-colors duration-300 text-sm sm:text-base font-medium px-4"
                                >
                                    {link.label}
                                </a>
                                {index < array.length - 1 && (
                                    <span className="hidden sm:block w-px h-4 bg-gray-700"></span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-500 text-sm font-light tracking-wide text-center">
                        &copy; Priyo Picxel&trade; Copyrights 2025. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
