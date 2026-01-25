import React from 'react';
import { ArrowRight } from 'lucide-react';
import { content } from '../../data/content';
import Image from '../common/Image';

const PromoBanner = () => {
    const { promoBanner } = content;

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] md:h-[500px]">

                    {/* Left Side - Image (40%) */}
                    <div className="w-full md:w-[40%] h-64 md:h-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-black/0 transition-colors duration-500"></div>
                        <Image
                            src={promoBanner.image}
                            alt="Gift giving"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                    </div>

                    {/* Right Side - Content (60%) */}
                    <div className="w-full md:w-[60%] bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">

                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-purple-500/20 blur-2xl"></div>

                        {/* Content Overlay Box */}
                        <div className="relative z-10 border-2 border-white/20 rounded-2xl p-6 md:p-10 backdrop-blur-sm bg-white/5">
                            <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider mb-6">
                                {promoBanner.badge}
                            </span>

                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                {promoBanner.title} <br />
                                <span className="text-yellow-300">{promoBanner.titleHighlight}</span>
                            </h2>

                            <p className="text-purple-100 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                                {promoBanner.description}
                            </p>

                            <button className="inline-flex items-center px-8 py-4 bg-white text-purple-700 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-400 hover:text-yellow-900 transform hover:-translate-y-1 transition-all duration-300 group">
                                {promoBanner.buttonText}
                                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
