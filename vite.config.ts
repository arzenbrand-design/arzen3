import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'hero-campaign-publisher',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/publish-hero' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  const { desktopImage, mobileImage, settings } = data;

                  const heroDir = path.resolve(__dirname, 'public/assets/hero');
                  if (!fs.existsSync(heroDir)) {
                    fs.mkdirSync(heroDir, { recursive: true });
                  }

                  // 1. Save Desktop image if it's base64
                  if (desktopImage && desktopImage.startsWith('data:image/')) {
                    const base64Data = desktopImage.replace(/^data:image\/\w+;base64,/, "");
                    fs.writeFileSync(path.join(heroDir, 'arzen-hero.jpg'), base64Data, 'base64');
                  }

                  // 2. Save Mobile image if it's base64
                  if (mobileImage && mobileImage.startsWith('data:image/')) {
                    const base64Data = mobileImage.replace(/^data:image\/\w+;base64,/, "");
                    fs.writeFileSync(path.join(heroDir, 'arzen-hero-mobile.jpg'), base64Data, 'base64');
                  }

                  // 3. Save hero-config.json
                  if (settings) {
                    fs.writeFileSync(
                      path.join(heroDir, 'hero-config.json'),
                      JSON.stringify(settings, null, 2)
                    );
                  }

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
