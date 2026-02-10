import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Headphones, Globe, Facebook, Instagram, MessageCircle } from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState(''); // 'success', 'error', ''

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            alert('Thank you for contacting us! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
            setSubscribeStatus('error');
            return;
        }
        // Simulate API call
        setSubscribeStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setSubscribeStatus(''), 3000);
    };

    const contactInfo = [
        {
            icon: <MapPin className="w-8 h-8 text-white" />,
            title: "Priyo Picxel",
            subtitle: "A Digital Printing Studio",
            details: "Ground Floor, Aradhya Market & Complex, Dhamua Station Rd, Dhamua, West Bengal 743610",
            bg: "bg-purple-600",
            delay: "delay-100"
        },
        {
            icon: <Headphones className="w-8 h-8 text-white" />,
            title: "💬 Customer Support",
            details: "24/7 Assistance Available",
            bg: "bg-blue-600",
            delay: "delay-200"
        },
        {
            icon: <Mail className="w-8 h-8 text-white" />,
            title: "📧 Email",
            details: "priyopicxel@gmail.com",
            link: "mailto:priyopicxel@gmail.com",
            bg: "bg-[#EA7704]",
            delay: "delay-300"
        },
        {
            icon: <Phone className="w-8 h-8 text-white" />,
            title: "📱 Phone / WhatsApp",
            details: "+91 9903349695",
            link: "tel:+919903349695",
            bg: "bg-green-600",
            delay: "delay-400"
        }
    ];

    return (
        <div className="pt-20"> {/* Add padding-top to account for fixed header */}
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20 sm:py-28 relative overflow-hidden">
                {/* Background Pattern/Overlay - Parallax Effect */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay bg-fixed"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
                    <Reveal animation="slideInLeft" delay="delay-100">
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                            📞 Contact Us – <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Priyo Picxel</span>
                        </h1>
                    </Reveal>

                    <Reveal animation="slideInRight" delay="delay-300">
                        <p className="text-2xl sm:text-3xl font-semibold text-[#EA7704] mt-4 font-display">
                            We're always here to help you
                        </p>
                    </Reveal>

                    <Reveal animation="fadeIn" delay="delay-500">
                        <div className="w-24 h-1 bg-[#EA7704] mx-auto mt-6 rounded-full opacity-80"></div>
                    </Reveal>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((info, index) => {
                        const CardContent = () => (
                            <div className="h-full bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-b-4 border-transparent hover:border-[#EA7704]">
                                <div className={`${info.bg} p-4 rounded-full mb-6 shadow-lg transform transition-transform group-hover:rotate-12`}>
                                    {info.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                                {info.subtitle && <p className="text-[#EA7704] font-medium mb-2 text-sm uppercase tracking-wide">{info.subtitle}</p>}
                                <p className={`text-gray-600 leading-relaxed ${info.link ? 'group-hover:text-[#EA7704] transition-colors font-semibold' : ''}`}>
                                    {info.details}
                                </p>
                            </div>
                        );

                        return (
                            <Reveal key={index} animation="slideInUp" delay={info.delay}>
                                {info.link ? (
                                    <a href={info.link} className="block h-full group" aria-label={info.title}>
                                        <CardContent />
                                    </a>
                                ) : (
                                    <div className="h-full group">
                                        <CardContent />
                                    </div>
                                )}
                            </Reveal>
                        );
                    })}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
                    {/* Contact Form */}
                    <Reveal animation="slideInRight">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8 sm:p-10">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                                    Send us a <span className="text-[#EA7704]">Message</span>
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-700 block">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#EA7704] focus:ring-2 focus:ring-[#EA7704] focus:ring-opacity-20 outline-none transition-all"
                                                placeholder="Your Name"
                                                required
                                                aria-label="Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#EA7704] focus:ring-2 focus:ring-[#EA7704] focus:ring-opacity-20 outline-none transition-all"
                                                placeholder="Your Email"
                                                required
                                                aria-label="Email"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium text-gray-700 block">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#EA7704] focus:ring-2 focus:ring-[#EA7704] focus:ring-opacity-20 outline-none transition-all"
                                            placeholder="Subject"
                                            required
                                            aria-label="Subject"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-gray-700 block">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#EA7704] focus:ring-2 focus:ring-[#EA7704] focus:ring-opacity-20 outline-none transition-all resize-none"
                                            placeholder="How can we help you?"
                                            required
                                            aria-label="Message"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-[#EA7704] text-white font-bold py-4 rounded-lg hover:bg-[#d66b03] transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        aria-label="Send Message"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Clock className="w-5 h-5 animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Reveal>

                    {/* Interactive Map */}
                    <Reveal animation="slideInLeft">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="h-[400px] w-full">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14764.717154269927!2d88.4552431!3d22.3084478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a026b0033ad560d%3A0x7d2874133405c75!2sPriyo%20Picxel!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Priyo Picxel Location"
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <div className="p-6 text-center bg-gray-50 border-t border-gray-100">
                                <a
                                    href="https://maps.app.goo.gl/K1nvQNd3TbPVbJvR7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-[#EA7704] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#d66b03] hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                                    aria-label="Get Directions"
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span>Get Directions</span>
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Connect With Us Section */}
                <div className="mt-20 mb-16">
                    <Reveal animation="fadeInUp">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 uppercase tracking-wider">
                                Connect <span className="text-[#EA7704]">With Us</span>
                            </h2>
                            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                                {[
                                    { icon: <Globe className="w-6 h-6" />, label: "Website", href: "https://priyopicxel.in", color: "bg-gray-800", hoverColor: "hover:bg-[#EA7704]" },
                                    { icon: <Facebook className="w-6 h-6" />, label: "Facebook", href: "https://www.facebook.com/PriyoPicxel", color: "bg-blue-600", hoverColor: "hover:bg-blue-700" },
                                    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "https://www.instagram.com/priyopicxel", color: "bg-gradient-to-r from-purple-500 to-pink-500", hoverColor: "hover:opacity-90" },
                                    { icon: <Mail className="w-6 h-6" />, label: "Email", href: "mailto:priyopicxel@gmail.com", color: "bg-red-500", hoverColor: "hover:bg-red-600" },
                                    { icon: <MessageCircle className="w-6 h-6" />, label: "WhatsApp", href: "https://wa.me/919903349695", color: "bg-green-500", hoverColor: "hover:bg-green-600" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${social.color} ${social.hoverColor} text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-2xl group`}
                                        aria-label={social.label}
                                    >
                                        <div className="transform transition-transform duration-300 group-hover:scale-110">
                                            {social.icon}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Newsletter Section */}
                <div className="mt-20 mb-20">
                    <Reveal animation="fadeInUp">
                        <div className="bg-gray-100 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-inner">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-wide">
                                SIGN UP FOR <span className="text-[#EA7704]">EMAIL OFFERS & UPDATES</span>
                            </h2>
                            <form onSubmit={handleSubscribe} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => {
                                        setNewsletterEmail(e.target.value);
                                        setSubscribeStatus('');
                                    }}
                                    placeholder="Enter your email"
                                    className={`flex-1 px-6 py-4 rounded-full border ${subscribeStatus === 'error' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 focus:border-[#EA7704] focus:ring-2 focus:ring-[#EA7704] focus:ring-opacity-20'} outline-none shadow-sm text-gray-700 placeholder-gray-400 transition-all`}
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-[#EA7704] hover:bg-[#d66b03] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    Subscribe <Send className="w-4 h-4 ml-1" />
                                </button>
                            </form>
                            {subscribeStatus === 'success' && (
                                <p className="text-green-600 font-medium mt-4 animate-fadeIn">
                                    ✓ You've successfully subscribed!
                                </p>
                            )}
                            {subscribeStatus === 'error' && (
                                <p className="text-red-500 font-medium mt-4 animate-fadeIn">
                                    Please enter a valid email address.
                                </p>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default Contact;
