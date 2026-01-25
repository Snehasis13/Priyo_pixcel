import React from 'react';
import { motion } from 'framer-motion';
import { Search, Rss, ArrowRight } from 'lucide-react';
import Reveal from '../Reveal/Reveal';
import AnimatedButton from '../common/AnimatedButton';

const BlogSidebar = ({ searchTerm, setSearchTerm, categories, tags }) => {
    return (
        <div className="space-y-24 sticky top-32">
            <Reveal animation="fadeInLeft" delay="delay-200">

                <div className="space-y-12">
                    {/* Search - Minimal Pill Style */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-[#EA7704]/20 focus:bg-white transition-all font-medium text-gray-700 shadow-sm hover:shadow-md"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4 group-hover:text-[#EA7704] transition-colors" />
                    </div>

                    {/* RSS Feed - Modern Gradient Card */}
                    <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl group">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EA7704] to-red-600 transition-transform duration-500 group-hover:scale-110" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2">
                                <Rss className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">Stay Updated</h4>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Get our latest design tips directly in your feed.
                                </p>
                            </div>

                            <a href="/rss.xml" className="inline-flex items-center font-bold text-sm mt-2 group/btn">
                                Subscribe via RSS
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                    </div>
                </div>

            </Reveal>
        </div>
    );
};

export default BlogSidebar;
