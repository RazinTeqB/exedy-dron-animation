import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
    return {
        root: path.resolve(__dirname, "src"),
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
        build: {
            outDir: path.resolve(__dirname, "dist"),
            emptyOutDir: true,
        },
    };
});
