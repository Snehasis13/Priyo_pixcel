import React from 'react';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import CategorySection from '../components/CategorySection/CategorySection';
import PromoBanner from '../components/PromoBanner/PromoBanner';
import Reveal from '../components/Reveal/Reveal';

const Home = () => {
    return (
        <main>
            <Hero />
            <Reveal animation="fadeIn" delay="delay-200" className="mb-16">
                <Features />
            </Reveal>
            <Reveal animation="slideInUp" className="mb-16">
                <ProductGrid />
            </Reveal>
            <div className="space-y-16 mb-16">
                <Reveal animation="slideInRight">
                    <CategorySection title="LED Wooden Cutout Photo Frames" category="LED Frames" />
                </Reveal>
                <Reveal animation="slideInLeft">
                    <CategorySection title="Photo Frames" category="Photo Frames" />
                </Reveal>
                <Reveal animation="slideInRight">
                    <CategorySection title="Business Card" category="Business Cards" />
                </Reveal>
                <Reveal animation="slideInLeft">
                    <CategorySection title="Customized CAFFE MUGS" category="Mugs" />
                </Reveal>
                <Reveal animation="slideInRight">
                    <CategorySection title="T-shirt" category="T-Shirts" />
                </Reveal>
            </div>
            <Reveal animation="bounceInUp" className="mb-16">
                <PromoBanner />
            </Reveal>
        </main>
    );
};

export default Home;
