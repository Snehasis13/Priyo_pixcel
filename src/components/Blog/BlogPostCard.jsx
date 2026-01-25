import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, MessageCircle, ArrowRight, Tag, Folder } from 'lucide-react';
import Image from '../common/Image';
import { Link } from 'react-router-dom';

const BlogPostCard = ({ post, index }) => {
    // Truncate excerpt
    const truncatedExcerpt = post.excerpt.length > 150
        ? post.excerpt.substring(0, 150) + "..."
        : post.excerpt;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col transform hover:-translate-y-1 relative"
        >
            {/* Top Border Accent on Hover - using pseudo-element logic via absolute div */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#EA7704] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

            {/* Featured Image (16:9) */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
            </div>

            <div className="p-6 flex flex-col flex-grow">

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#EA7704] transition-colors cursor-pointer">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>

                {/* Meta Information Bar */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4 border-b border-gray-100 pb-4">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                    </span>
                    <Link to={`/author/${post.author}`} className="flex items-center gap-1 hover:text-[#EA7704] transition-colors">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                    </Link>
                    <Link to={`/blog/${post.id}#comments`} className="flex items-center gap-1 hover:text-[#EA7704] transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.commentsCount} Comments
                    </Link>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                    {truncatedExcerpt}
                </p>

                {/* Read More */}
                <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#EA7704] font-bold text-sm tracking-wide group/link mb-6"
                >
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>

                {/* Tags & Categories */}
                <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Tag className="w-3.5 h-3.5 text-gray-400 mt-1" />
                            {post.tags.map((tag, i) => (
                                <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Categories */}
                    <div className="flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {post.category}
                        </span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default BlogPostCard;
