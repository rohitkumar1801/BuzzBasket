import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        // Ensure the file is a .js file in the src directory
        if (!id.endsWith('.js') || !id.includes('/src/')) return null;

        // Use transformWithEsbuild to handle JSX in .js files
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Treat all .js files as JSX
      },
    },
  },
});
