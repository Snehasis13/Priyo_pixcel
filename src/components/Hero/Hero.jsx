import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { content } from '../../data/content';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const timeoutRef = useRef(null);

    const { slides } = content.hero;

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        if (isPlaying) {
            timeoutRef.current = setTimeout(() => {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 5000);
        }
        return () => resetTimeout();
    }, [isPlaying, currentSlide, slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="relative w-full h-[80vh] md:h-[600px] overflow-hidden bg-gray-900 group">
            {/* Slider Content */}
            <div
                className="w-full h-full whitespace-nowrap transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${-currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="inline-block w-full h-full relative whitespace-normal align-top"
                    >
                        {/* Background Gradient */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                background: 'linear-gradient(135deg, rgba(213, 96, 115, 0.88), rgba(255, 255, 143, 0.5))'
                            }}
                        />

                        {/* Text Content */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in duration-700">
                                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold tracking-wider border border-white/30 uppercase mb-2">
                                    {slide.subtitle}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                                    {slide.description}
                                </p>
                                <div className="pt-4">
                                    <button className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl flex items-center mx-auto">
                                        {slide.buttonText} <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="text-white hover:text-purple-200 transition-colors focus:outline-none"
                    aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                {/* Dots */}
                <div className="flex space-x-2 border-l border-white/20 pl-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;

