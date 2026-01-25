/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                'sm': '640px',
                // 'md': '768px', // Default
                'lg': '992px', // Custom Desktop Breakpoint requested by user
                // 'xl': '1280px', // Default
                // '2xl': '1536px', // Default
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Assuming Inter or similar based on "font-sans" usage
            },
        },
    },
    plugins: [],
}
