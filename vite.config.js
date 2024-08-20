import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

export default {
    base: './',
    plugins: [
        vituum({
            pages: {
                normalizeBasePath: true
            }
        }),
        pug({
            options : {
                pretty: true
            }
        })
    ],
    build: {
        rollupOptions: {
            input: ['./src/pages/**/*.pug'],
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').pop();
                    if (/css/i.test(extType)) {
                        return 'styles/[name][extname]';
                    }
                    if (/js/i.test(extType)) {
                        return 'scripts/[name][extname]';
                    }
                    return 'assets/[name][extname]';
                },
                entryFileNames: `scripts/[name].js`,
                chunkFileNames: `scripts/[name].js`,
            }
        }
    },
    css: {
        devSourcemap: true
    }
};
