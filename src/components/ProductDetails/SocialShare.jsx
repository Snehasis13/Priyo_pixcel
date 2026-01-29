import React from 'react';
import { Facebook, Twitter, Link as LinkIcon, Smartphone } from 'lucide-react';

const SocialShare = ({ product }) => {
    const currentUrl = window.location.href;
    const shareText = `Check out ${product?.name} on Priyo Pixcel!`;

    const shareLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
            color: 'hover:text-blue-600',
            bg: 'hover:bg-blue-50'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
            color: 'hover:text-sky-500',
            bg: 'hover:bg-sky-50'
        },
        {
            name: 'WhatsApp',
            icon: Smartphone, // Using Smartphone as generic icon, or external simple-icons if available. Lucide doesn't have Whatsapp.
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
            color: 'hover:text-green-500',
            bg: 'hover:bg-green-50'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentUrl);
        // Toast handled by parent if needed, or simple alert/visual feedback
    };

    return (
        <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium text-gray-500 mr-2">Share:</span>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full text-gray-400 transition-all duration-200 border border-transparent hover:border-gray-200 ${link.color} ${link.bg}`}
                    aria-label={`Share on ${link.name}`}
                >
                    <link.icon size={18} />
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="p-2 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 border border-transparent hover:border-purple-100"
                title="Copy Link"
            >
                <LinkIcon size={18} />
            </button>
        </div>
    );
};

export default SocialShare;
