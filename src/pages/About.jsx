import React from 'react';
import Reveal from '../components/Reveal/Reveal';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Reveal animation="fadeInDown">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                            About <span className="text-[#EA7704]">Priyo Picxel</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-gray-600">
                            Preserving your precious memories with premium quality photo printing and framing services.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <Reveal animation="fadeInLeft">
                        <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-gray-200">
                            {/* Placeholder for About Image */}
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Aboute Image Placeholder
                            </div>
                        </div>
                    </Reveal>
                    <Reveal animation="fadeInRight">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Founded with a passion for photography and design, Priyo Picxel began as a small studio dedicated to bringing digital memories into the physical world. We believe that every photo tells a story, and that story deserves to be displayed beautifully.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Today, we offer a wide range of custom printing and framing solutions, all crafted with the highest quality materials and attention to detail. Whether you're looking to decorate your home or find the perfect gift, we're here to help you create something special.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default About;
