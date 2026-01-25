import React from 'react';
import { Truck, ShieldCheck, Headphones, Lock } from 'lucide-react';
import { content } from '../../data/content';

const iconMap = {
    Truck: Truck,
    ShieldCheck: ShieldCheck,
    Headphones: Headphones,
    Lock: Lock
};

const Features = () => {
    const { features } = content;

    return (
        <section className="py-16 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {features.title}
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        {features.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 lg:grid-cols-4 gap-x-8">
                    {features.list.map((feature, index) => {
                        const Icon = iconMap[feature.iconName];
                        return (
                            <div
                                key={feature.name}
                                className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 text-center"
                            >
                                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${feature.bg} ${feature.color} mb-6 transition-transform group-hover:scale-110`}>
                                    {Icon && <Icon className="h-8 w-8" aria-hidden="true" />}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    {feature.name}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                                {feature.contact && (
                                    <p className="mt-2 text-xs font-semibold text-gray-400">
                                        {feature.contact}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
