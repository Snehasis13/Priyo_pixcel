import { Truck, ShieldCheck, Headphones, Lock } from 'lucide-react';

export const content = {
    header: {
        contact: {
            phone: "+91 9903349695",
            email: "hello@priyopixcel.com"
        },
        logo: "Priyo Pixcel",
        nav: [
            { label: "Home", href: "/" },
            { label: "All Products", href: "/products" },
            { label: "Custom Frames", href: "/custom-frame" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" }
        ]
    },
    hero: {
        slides: [
            {
                id: 1,
                title: "Welcome to Priyo Picxel",
                subtitle: "Premium Digital Printing Services",
                description: "Experience the art of perfect printing with our state-of-the-art technology and creative solutions.",
                buttonText: "Get Started",
                link: "/products"
            },
            {
                id: 2,
                title: "Quality You Can Trust",
                subtitle: "Custom Prints & Designs",
                description: "Priyopicxel brings you premium-quality custom prints with trusted service, secure payments, and a commitment to excellence",
                buttonText: "View Catalog",
                link: "/custom-frame"
            }
        ]
    },
    features: {
        title: "Why Shop With Us",
        subtitle: "We prioritize your satisfaction with every order.",
        list: [
            {
                name: 'Free Shipping',
                description: '100% Free Shipping All Over India',
                iconName: 'Truck',
                color: 'text-blue-500',
                bg: 'bg-blue-100'
            },
            {
                name: 'Quality Products',
                description: 'High-Quality Fabric | Long-Lasting Comfort | 100% Quality Assured',
                iconName: 'ShieldCheck',
                color: 'text-purple-500',
                bg: 'bg-purple-100'
            },
            {
                name: '24/7 Support',
                description: '24/7 Support via Call, email, Chat & WhatsApp',
                contact: '+91 9903349695',
                iconName: 'Headphones',
                color: 'text-green-500',
                bg: 'bg-green-100'
            },
            {
                name: 'Secure Payment',
                description: '100% Secure Payment | Your Payment Information Is Fully Protected',
                iconName: 'Lock',
                color: 'text-red-500',
                bg: 'bg-red-100'
            },
        ]
    },
    productGrid: {
        title: "Featured Products",
        subtitle: "Explore our best-selling customized products",
        viewAll: "View All Products"
    },
    promoBanner: {
        image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop",
        badge: "Limited Time Offer",
        title: "You're Special!",
        titleHighlight: "Say It With A Gift",
        description: "Make every moment unforgettable with our customized premium gifts. Perfect for birthdays, anniversaries, or just because.",
        buttonText: "Shop Now!!"
    },
    footer: {
        brand: {
            name: "Priyo Pixcel",
            description: "Your one-stop shop for custom printing and personalized gifts. We verify quality at every step."
        },
        columns: [
            {
                title: "Shop",
                links: [
                    { label: "New Arrivals", href: "#" },
                    { label: "Best Sellers", href: "#" },
                    { label: "Custom Printing", href: "#" },
                    { label: "Bulk Orders", href: "#" }
                ]
            },
            {
                title: "Support",
                links: [
                    { label: "Contact Us", href: "#" },
                    { label: "FAQs", href: "#" },
                    { label: "Shipping & Returns", href: "#" },
                    { label: "Privacy Policy", href: "#" }
                ]
            }
        ],
        contact: {
            title: "Get items delivered",
            address: "123 Design Street, Pixel City",
            phone: "+91 9903349695", // Updated to match header
            email: "hello@priyopixcel.com"
        },
        socials: [
            { label: "Facebook", href: "#" },
            { label: "Instagram", href: "#" },
            { label: "Twitter", href: "#" }
        ],
        copyright: "© 2024 Priyo Pixcel. All rights reserved."
    }
};
