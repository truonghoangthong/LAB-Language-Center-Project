/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["Dela Gothic One"],
                body: ["Montserrat"],                   

            },
        },
    },
    plugins: [],
};
