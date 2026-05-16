import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {crx, type ManifestV3Export} from '@crxjs/vite-plugin'
import rawManifest from './manifest.json'

const manifest = rawManifest as unknown as ManifestV3Export

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        crx({ manifest })
    ],
    server:{
        port: 3000,
        strictPort: true
    }
})
