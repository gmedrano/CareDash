import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

/*
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }, 
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});*/

export default defineConfig(({ command, mode }) => {
  const isPresentation = mode === 'presentation'
  console.log('isPresentation****', isPresentation)
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: isPresentation ? 5174 : 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        input: isPresentation
          ? {
              presentation: path.resolve(__dirname, 'index-presentation.html')
            }
          : {
              main: path.resolve(__dirname, 'index.html')
            }
      },
      outDir: isPresentation ? 'dist-presentation' : 'dist'
    }
  }
})