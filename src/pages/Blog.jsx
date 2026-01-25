import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';
import Image from '../components/common/Image';
import AnimatedButton from '../components/common/AnimatedButton';
import BlogPostCard from '../components/Blog/BlogPostCard';
import BlogSidebar from '../components/Blog/BlogSidebar';

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { name: "Design Trends", count: 12 },
        { name: "Printing Tech", count: 8 },
        { name: "Gifting Guide", count: 15 },
        { name: "Business Solutions", count: 6 },
        { name: "Tutorials", count: 10 }
    ];

    const tags = [
        "Custom T-Shirts", "Mugs", "Corporate Gifts", "Sustainability", "Design", "Tips", "Seasonal", "Offers"
    ];

    const posts = [
        {
            id: 1,
            title: "Top 5 Personalized Gift Ideas for 2024",
            excerpt: "Make your loved ones feel special with these trending custom gift ideas that are perfect for any occasion. From 3D photo frames to personalized mugs, discover what's hot this season.",
            image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop",
            date: "15.01.24 10:30 AM",
            readTime: "5 min read",
            category: "Gifting Guide",
            author: "Sarah J.",
            commentsCount: 24,
            tags: ["Gifts", "Personalized", "2024"]
        },
        {
            id: 2,
            title: "The Future of Digital Printing Technology",
            excerpt: "Explore how AI and advanced printing techniques are revolutionizing the custom merchandise industry. We dive deep into direct-to-film printing and eco-friendly inks.",
            image: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=800&auto=format&fit=crop",
            date: "10.01.24 02:15 PM",
            readTime: "8 min read",
            category: "Printing Tech",
            author: "Mike T.",
            commentsCount: 18,
            tags: ["Tech", "Printing", "AI"]
        },
        {
            id: 3,
            title: "Creating the Perfect Corporate Identity",
            excerpt: "Why branded merchandise is crucial for building a strong lasting impression for your business. Learn how custom business cards and apparel can elevate your brand.",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
            date: "05.01.24 09:00 AM",
            readTime: "6 min read",
            category: "Business Solutions",
            author: "Jessica L.",
            commentsCount: 32,
            tags: ["Business", "Branding", "Corporate"]
        },
        {
            id: 4,
            title: "DIY Design Tips for Custom T-Shirts",
            excerpt: "Professional tips to ensure your t-shirt designs look amazing when printed. We cover color theory, resolution requirements, and placement guides.",
            image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop",
            date: "28.12.23 04:45 PM",
            readTime: "4 min read",
            category: "Tutorials",
            author: "David R.",
            commentsCount: 12,
            tags: ["Design", "T-Shirts", "DIY"]
        },
        {
            id: 5,
            title: "Eco-Friendly Printing: A Sustainable Choice",
            excerpt: "How we're reducing our carbon footprint with biodegradable materials and eco-inks. Join us in our journey towards a greener future for printing technology.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5afa?q=80&w=800&auto=format&fit=crop",
            date: "20.12.23 11:20 AM",
            readTime: "5 min read",
            category: "Printing Tech",
            author: "Green Team",
            commentsCount: 45,
            tags: ["Eco-Friendly", "Sustainability", "Green"]
        }
    ];

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            {/* Header Section */}
            <div className="bg-gray-50 mb-12 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Reveal animation="fadeInDown">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-[#EA7704] text-sm font-bold tracking-wide mb-4">
                            PRIYO PICXEL CONTENT
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                            <span className="bg-gradient-to-r from-[#EA7704] to-purple-600 bg-clip-text text-transparent">
                                Our Blog & Insights
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Discover the latest trends in digital printing, design inspiration, and gifting ideas curated by our experts.
                        </p>
                    </Reveal>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Area (9 Columns) */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredPosts.map((post, index) => (
                                    <BlogPostCard key={post.id} post={post} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">No posts found</h3>
                                <p className="text-gray-500">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (3 Columns) */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <BlogSidebar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categories={categories}
                            tags={tags}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Blog;
