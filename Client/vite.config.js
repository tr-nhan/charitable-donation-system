import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import { createHtmlPlugin } from "vite-plugin-html";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000
    },
    plugins: [
        react(),
        legacy({
            targets: ["defaults"]
        }),
        createHtmlPlugin({ minify: true }),
        tailwindcss(),
    ],
    build: {
        chunkSizeWarningLimit: 750
    }
});
