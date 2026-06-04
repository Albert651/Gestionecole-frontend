import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration de Vite (le serveur de developpement React)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // le port autorise dans la config CORS du backend
  },
})
